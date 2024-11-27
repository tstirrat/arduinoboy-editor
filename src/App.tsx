import { useCallback, useContext, useRef, useState } from "react";
import { ConnectionPanel } from "./components/ConnectionPanel";
import { Flex } from "./components/Flex";
import { MgbSettings } from "./components/MgbSettings";
import { Settings } from "./lib/settings";
import { LsdjSlaveModeSettings } from "./components/LsdjSlaveModeSettings";
import { LsdjMasterModeSettings } from "./components/LsdjMasterModeSettings";
import { LsdjSyncmapSettings } from "./components/LsdjSyncmapSettings";
import { KeyboardModeSettings } from "./components/KeyboardModeSettings";
import { LsdjMidiOutModeSettings } from "./components/LsdjMidiOutModeSettings";
import { Text } from "./components/Typography";
import { ModeSettings } from "./components/ModeSettings";
import { SaveButtons } from "./components/SaveButtons";
import { useProgrammerSettings } from "./hooks/use_programmer_settings";
import { useMidiAccess, useMidiPermission } from "./hooks/use_midi";
import { MAJOR_VERSION, MINOR_VERSION } from "./lib/programmer";
import { Toast } from "primereact/toast";
import { PrimeIcons, PrimeReactContext } from "primereact/api";
import { Button } from "primereact/button";
import { ThemeButton } from "./components/ThemeButton";

type Theme = "light" | "dark";

function App() {
  const perm = useMidiPermission();
  const midi = useMidiAccess();

  const {
    isConnected,
    settings,
    setSettings,
    connect,
    disconnect,
    saveSettings,
    refreshSettings,
    resetSettings,
  } = useProgrammerSettings({ midi });

  const updatePartialSettings = useCallback(
    (updated: Partial<Settings>) => {
      setSettings((prev) => (prev ? { ...prev, ...updated } : prev));
    },
    [setSettings]
  );

  const toast = useRef<Toast>(null);

  if (!perm) return <strong>Error: No Web MIDI permission</strong>;
  if (!midi) return <strong>Error: No MIDIAccess</strong>;
  if (!midi.sysexEnabled)
    return <strong>Error: MIDI SysEx not available</strong>;

  const showError = (message: string) => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: message,
      life: 3000,
    });
  };

  const connectAndShowErrors = async (outName: string, inName: string) => {
    try {
      await connect(outName, inName);
    } catch (e) {
      showError((e as Error).message);
    }
  };

  return (
    <Flex row justify="center" align="center">
      <Toast ref={toast} />
      <Flex col align="stretch" style={{ maxWidth: 1000 }}>
        <Flex row align="center" justify="space-between">
          <Text variant="h1">
            ArduinoBoy Web Editor for v{MAJOR_VERSION}.{MINOR_VERSION}
          </Text>
          <ThemeButton />
        </Flex>
        <Flex row justify="space-between">
          <Flex grow="1">
            <ConnectionPanel
              isConnected={isConnected}
              onConnect={connectAndShowErrors}
              onDisconnect={disconnect}
              midi={midi}
            />
          </Flex>
          <ModeSettings value={settings} onChange={updatePartialSettings} />
        </Flex>

        <Flex row>
          <LsdjSlaveModeSettings
            value={settings}
            onChange={updatePartialSettings}
          />
          <LsdjMasterModeSettings
            value={settings}
            onChange={updatePartialSettings}
          />
          <KeyboardModeSettings
            value={settings}
            onChange={updatePartialSettings}
          />
        </Flex>

        <Flex row>
          <MgbSettings value={settings} onChange={updatePartialSettings} />
          <LsdjSyncmapSettings
            value={settings}
            onChange={updatePartialSettings}
          />
        </Flex>

        <SaveButtons
          isConnected={isConnected}
          onSave={saveSettings}
          onRefresh={refreshSettings}
          onReset={resetSettings}
        />

        <LsdjMidiOutModeSettings
          value={settings}
          onChange={updatePartialSettings}
        />
      </Flex>
    </Flex>
  );
}

export default App;
