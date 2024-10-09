import { useRef, useState } from "react";
import { Settings, toSettings } from "../lib/settings";
import {
  connect,
  getSettings as programmerGetSettings,
  setSettings as programmerSetSettings,
} from "../lib/programmer";
import { Task } from "../types";

export function useProgrammerSettings({
  midi,
}: {
  midi: MIDIAccess | undefined;
}) {
  const [state, setState] = useState<{
    isConnected: boolean;
    disconnect: Task | undefined;
  }>({
    isConnected: false,
    disconnect: undefined,
  });

  const input = useRef<MIDIInput | undefined>();
  const output = useRef<MIDIOutput | undefined>();

  const [settings, setSettings] = useState<Settings>();

  const connectWrapper = async (outputName: string, inputName: string) => {
    if (!midi) throw new Error("MIDI not initialised");

    input.current = [...midi.inputs.values()].find((o) => o.name === inputName);
    output.current = [...midi.outputs.values()].find(
      (o) => o.name === outputName
    );
    if (!input.current) throw new Error(`In port not found ${inputName}`);
    if (!output.current) throw new Error(`Out port not found ${outputName}`);

    console.log("Connecting...", outputName, inputName);
    const { settingsData, disconnect } = await connect(
      input.current,
      output.current
    );

    console.log("Got settings", toSettings(settingsData));
    setSettings(toSettings(settingsData));
    setState({ isConnected: true, disconnect });
  };

  const disconnect = () => {
    if (state.disconnect) {
      state.disconnect();
      setState({ isConnected: false, disconnect: undefined });
      input.current = undefined;
      output.current = undefined;
    }
  };

  const refreshSettings = async () => {
    if (!input.current) throw new Error(`In port not found!`);
    if (!output.current) throw new Error(`Out port not found!`);
    const newSettings = await programmerGetSettings(
      input.current,
      output.current
    );
    setSettings(toSettings(newSettings));
  };

  const saveSettings = async () => {
    if (!input.current) throw new Error(`In port not found!`);
    if (!output.current) throw new Error(`Out port not found!`);
    if (!settings) throw new Error("settings are not loaded");

    const newSettings = await programmerSetSettings(
      input.current,
      output.current,
      settings
    );
    setSettings(toSettings(newSettings));
  };

  return {
    connect: connectWrapper,
    isConnected: state.isConnected,
    settings,
    setSettings,
    disconnect,
    refreshSettings,
    saveSettings,
  };
}
