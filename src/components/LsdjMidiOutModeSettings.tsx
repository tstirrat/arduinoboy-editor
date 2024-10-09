import { Card } from "primereact/card";
import { Callback } from "../types";
import { MidiOutConfig, Settings } from "../lib/settings";
import { UNKNOWN_CHANNEL } from "../lib/globals";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Flex } from "./Flex";
import { Field } from "./Field";
import { InputNumber } from "primereact/inputnumber";
import { Text } from "./Typography";

export type MidiOutSettings = Pick<Settings, "lsdjMidiOut">;

const DEFAULT_CHANNEL_VALUE: MidiOutConfig = {
  noteChannel: UNKNOWN_CHANNEL,
  ccChannel: UNKNOWN_CHANNEL,
  ccMode: 0,
  ccScaling: false,
  ccMessageNumbers: [0, 0, 0, 0, 0, 0, 0],
};

const DEFAULT_VALUE: MidiOutSettings = {
  lsdjMidiOut: {
    bitCheck: { delay: 0, multiplier: 0 },
    byteReceived: { delay: 0, multiplier: 0 },
    channels: [
      DEFAULT_CHANNEL_VALUE,
      DEFAULT_CHANNEL_VALUE,
      DEFAULT_CHANNEL_VALUE,
      DEFAULT_CHANNEL_VALUE,
    ],
  },
};

export const LsdjMidiOutModeSettings: React.FC<{
  value: MidiOutSettings | undefined;
  onChange: Callback<MidiOutSettings>;
}> = ({ value = DEFAULT_VALUE, onChange }) => {
  return (
    <Card title="LSDJ MIDI OUT Mode Settings (TODO)">
      <DataTable value={value.lsdjMidiOut.channels}>
        <Column field="noteChannel" header="Note CH" />
        <Column field="ccChannel" header="CC CH" />
        <Column field="ccMode" header="CC Mode" />
        <Column field="ccScaling" header="CC Scaling" />
        <Column field="ccScaling" header="CC Scaling" />

        {/* TODO:  ccMessageNumbers: [number, number, number, number, number, number, number] */}
      </DataTable>

      <Text variant="h3">LSDJ MIDI OUT Mode Advanced Settings</Text>
      <Flex row>
        <Field label="Bit check delay">
          {(id) => (
            <InputNumber
              id={id}
              value={value.lsdjMidiOut.bitCheck.delay}
              onChange={(e) =>
                onChange({
                  ...value,
                  lsdjMidiOut: {
                    ...value.lsdjMidiOut,
                    bitCheck: {
                      ...value.lsdjMidiOut.bitCheck,
                      delay: Number(e.value),
                    },
                  },
                })
              }
            />
          )}
        </Field>

        <Field label="Multiplier">
          {(id) => (
            <InputNumber
              id={id}
              value={value.lsdjMidiOut.bitCheck.multiplier}
              onChange={(e) =>
                onChange({
                  ...value,
                  lsdjMidiOut: {
                    ...value.lsdjMidiOut,
                    bitCheck: {
                      ...value.lsdjMidiOut.bitCheck,
                      multiplier: Number(e.value),
                    },
                  },
                })
              }
            />
          )}
        </Field>
      </Flex>
    </Card>
  );
};
