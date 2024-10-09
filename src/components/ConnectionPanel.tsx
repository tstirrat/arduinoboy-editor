import { Dropdown } from "primereact/dropdown";
import { Flex } from "./Flex";
import { useMemo, useState } from "react";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";
import { Field } from "./Field";
import { Card } from "primereact/card";
import { Task } from "../types";
import styled from "@emotion/styled";
import { exists } from "../lib/globals";

export const ConnectionPanel: React.FC<{
  midi: MIDIAccess;
  isConnected: boolean;
  onConnect: (outputName: string, inputName: string) => void;
  onDisconnect: Task;
}> = ({ midi, isConnected, onConnect, onDisconnect }) => {
  const { inputs, outputs } = useMidiPortNames({ midi });

  const [outputName, setOutputName] = useState<string | undefined>(undefined);
  const [inputName, setInputName] = useState<string | undefined>(undefined);

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
                disabled={isConnected}
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
                disabled={isConnected}
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
            onClick={() =>
              outputName && inputName && onConnect(outputName, inputName)
            }
            disabled={isConnected}
          />
          <ConnectionStatus isConnected={isConnected}>
            {isConnected ? "Connected" : "Not connected"}
          </ConnectionStatus>
          <Button
            severity="danger"
            icon={PrimeIcons.STOP_CIRCLE}
            type="button"
            onClick={() => onDisconnect()}
            disabled={!isConnected}
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

function useMidiPortNames({ midi }: { midi: MIDIAccess | undefined }) {
  const outputs = useMemo(() => {
    if (!midi) return [];

    return [...midi.outputs.values()].map((o) => o.name).filter(exists);
  }, [midi]);

  const inputs = useMemo(() => {
    if (!midi) return [];

    return [...midi.inputs.values()].map((o) => o.name).filter(exists);
  }, [midi]);

  return { inputs, outputs };
}
