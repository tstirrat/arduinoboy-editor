import { Card } from "primereact/card";
import { Callback } from "../types";
import { MidiOutConfig, Settings } from "../lib/settings";
import { UNKNOWN_CHANNEL } from "../lib/globals";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

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
}> = ({ value = DEFAULT_VALUE }) => {
  return (
    <Card title="LSDJ MIDI OUT Mode Settings">
      <DataTable
        value={value.lsdjMidiOut.channels}
        tableStyle={{ minWidth: "50rem" }}
      >
        <Column field="noteChannel" header="Note CH"></Column>
        <Column field="ccChannel" header="CC CH"></Column>
        <Column field="ccMode" header="CC Mode"></Column>
        {/* <Column field="quantity" header="Quantity"></Column> */}

        {/* noteChannel: number;
            ccChannel: number;
            ccMode: LsdjCcMode;
            ccMessageNumbers: [number, number, number, number, number, number, number];
            ccScaling: boolean; */}
      </DataTable>
    </Card>
  );
};
