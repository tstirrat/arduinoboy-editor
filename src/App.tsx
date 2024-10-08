import { useState } from "react";
import { ConnectionPanel } from "./components/ConnectionPanel";
import { Flex } from "./components/Flex";
import { MgbSettings } from "./components/MgbSettings";
import { Settings } from "./lib/settings";

function App() {
  const [settings, setSettings] = useState<Settings | undefined>(undefined);

  return (
    <Flex row justify="center" align="center">
      <Flex col align="stretch" gap={8} style={{ maxWidth: 800 }}>
        <ConnectionPanel onConnect={setSettings} />
        <MgbSettings settings={settings} />
      </Flex>
    </Flex>
  );
}

export default App;
