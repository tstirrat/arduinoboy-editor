import { Dropdown } from "primereact/dropdown";
import { useMidiPermission, useMidiPortNames } from "../hooks/use_midi";
import { Flex } from "./Flex";
import { FormEventHandler, useState } from "react";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";
import { connect } from "../lib/programmer";
import { Field } from "./Field";
import { Card } from "primereact/card";
import { Callback, Task } from "../types";
import { Settings, toSettings } from "../lib/settings";
import styled from "@emotion/styled";

export const ConnectionPanel: React.FC<{
  onConnect: Callback<Settings>;
}> = ({ onConnect }) => {
  const [outputName, setOutputName] = useState<string | undefined>(undefined);
  const [inputName, setInputName] = useState<string | undefined>(undefined);

  const perm = useMidiPermission();
  const { midi, inputs, outputs } = useMidiPortNames();

  const [state, setState] = useState<{
    isConnected: boolean;
    disconnect: Task | undefined;
  }>({
    isConnected: false,
    disconnect: undefined,
  });

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!midi || !outputName || !inputName)
      throw new Error("Missing input/output config");

    (async () => {
      console.log("Connecting...", outputName, inputName);
      const { settingsData, disconnect } = await connect(
        midi,
        outputName,
        inputName
      );

      console.log("Got settings", toSettings(settingsData));
      onConnect(toSettings(settingsData));
      setState({ isConnected: true, disconnect });
    })();
  };

  const handleDisconnect = () => {
    if (state.disconnect) {
      state.disconnect();
      setState({ isConnected: false, disconnect: undefined });
    }
  };

  if (!perm) return <strong>Error: Permission unavailable</strong>;

  if (!midi) return <strong>Error: No MIDIAccess</strong>;

  if (!midi.sysexEnabled) return <strong>Error: SysEx not enabled</strong>;

  if (!outputName && midi.outputs.size) {
    const first = [...midi.outputs.values()][0];

    if (first.name) setOutputName(first.name);
  }

  if (!outputName && midi.inputs.size) {
    const first = [...midi.inputs.values()][0];

    if (first.name) setInputName(first.name);
  }

  return (
    <Card title="Connection">
      <Flex col align="stretch">
        <Flex row align="center" justify="start" as="form">
          <Field label="Input" vertical>
            {(id) => (
              <Dropdown
                inputId={id}
                name="midiIn"
                options={inputs}
                value={inputName}
                onChange={(e) => setInputName(e.value)}
                placeholder="Select port"
              />
            )}
          </Field>
          <Field label="Output" vertical>
            {(id) => (
              <Dropdown
                inputId={id}
                name="midiOut"
                options={outputs}
                value={outputName}
                onChange={(e) => setOutputName(e.value)}
                placeholder="Select port"
              />
            )}
          </Field>
        </Flex>
        <Flex row align="stretch">
          <Button
            label="Connect"
            icon={PrimeIcons.PLAY}
            onClick={handleSubmit}
          />
          <ConnectionStatus isConnected={state.isConnected}>
            {state ? "Connected" : "Not connected"}
          </ConnectionStatus>
          <Button
            severity="danger"
            icon={PrimeIcons.STOP_CIRCLE}
            type="button"
            onClick={handleDisconnect}
            disabled={!state.isConnected}
          />
        </Flex>
      </Flex>
    </Card>
  );
};

const ConnectionStatus = styled.div<{ isConnected: boolean }>`
  background-color: ${({ isConnected }) => (isConnected ? "green" : "gray")};
  border: 1px solid gray;
  display: flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 4px;
`;
