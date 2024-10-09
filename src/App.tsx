import { useCallback } from "react";
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
import { ArduinoModeSettings } from "./components/ArduinoModeSettings";
import { SendSettings } from "./components/SendSettings";
import { useProgrammerSettings } from "./hooks/use_programmer_settings";
import { useMidiAccess, useMidiPermission } from "./hooks/use_midi";

function App() {
  const perm = useMidiPermission();
  const midi = useMidiAccess();

  const {
    isConnected,
    settings,
    setSettings,
    connect,
    disconnect,
    refreshSettings,
    saveSettings,
  } = useProgrammerSettings({ midi });

  const updatePartialSettings = useCallback(
    (updated: Partial<Settings>) => {
      setSettings((prev) => (prev ? { ...prev, ...updated } : prev));
    },
    [setSettings]
  );

  if (!perm) return <strong>Error: No Web MIDI permission</strong>;
  if (!midi) return <strong>Error: No MIDIAccess</strong>;
  if (!midi.sysexEnabled)
    return <strong>Error: MIDI SysEx not available</strong>;

  return (
    <Flex row justify="center" align="center">
      <Flex col align="stretch" style={{ maxWidth: 1000 }}>
        <Text variant="h1">ArduinoBoy Web Editor for v1.3</Text>
        <Flex row justify="space-between">
          <ConnectionPanel
            isConnected={isConnected}
            onConnect={connect}
            onDisconnect={disconnect}
            midi={midi}
          />
          <ArduinoModeSettings
            value={settings}
            onChange={updatePartialSettings}
          />
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
        <SendSettings
          isConnected={isConnected}
          onSave={saveSettings}
          onRefresh={refreshSettings}
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
