import { useState } from "react";
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

function App() {
  const [settings, setSettings] = useState<Settings | undefined>(undefined);

  const updateLsdjSlaveModeChannel = (
    lsdjSlaveModeChannel: Settings["lsdjSlaveModeChannel"]
  ) => {
    setSettings((prev) => (prev ? { ...prev, lsdjSlaveModeChannel } : prev));
  };

  const updateLsdjMasterModeChannel = (
    lsdjMasterModeChannel: Settings["lsdjMasterModeChannel"]
  ) => {
    setSettings((prev) => (prev ? { ...prev, lsdjMasterModeChannel } : prev));
  };

  const updatePartialSettings = (updated: Partial<Settings>) => {
    setSettings((prev) => (prev ? { ...prev, ...updated } : prev));
  };

  const handleSave = () => {};
  const handleRefresh = () => {};

  return (
    <Flex row justify="center" align="center">
      <Flex col align="stretch" style={{ maxWidth: 1000 }}>
        <Text variant="h1">ArduinoBoy Web Editor for v1.3</Text>
        <Flex row justify="space-between">
          <ConnectionPanel onConnect={setSettings} />
          <ArduinoModeSettings
            value={settings}
            onChange={updatePartialSettings}
          />
        </Flex>
        <Flex row>
          <LsdjSlaveModeSettings
            value={settings?.lsdjSlaveModeChannel}
            onChange={updateLsdjSlaveModeChannel}
          />
          <LsdjMasterModeSettings
            value={settings?.lsdjMasterModeChannel}
            onChange={updateLsdjMasterModeChannel}
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
        <SendSettings onSave={handleSave} onRefresh={handleRefresh} />
        <LsdjMidiOutModeSettings
          value={settings}
          onChange={updatePartialSettings}
        />
      </Flex>
    </Flex>
  );
}

export default App;
