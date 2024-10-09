import { Flex } from "./Flex";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { Callback } from "../types";
import { Settings } from "../lib/settings";
import { Field } from "./Field";
import { MIDI_CHANNEL_OPTIONS, UNKNOWN_CHANNEL } from "../lib/globals";

type LsdjSyncmapSettingsValue = Pick<Settings, "syncMapChannelStart">;

const DEFAULT_VALUE: LsdjSyncmapSettingsValue = {
  syncMapChannelStart: UNKNOWN_CHANNEL,
};

export const LsdjSyncmapSettings: React.FC<{
  value: LsdjSyncmapSettingsValue | undefined;
  onChange: Callback<LsdjSyncmapSettingsValue>;
}> = ({ value = DEFAULT_VALUE, onChange }) => {
  return (
    <Card title="LSDJ LIVEMAP/SYNCMAP Settings">
      <Flex row align="center">
        <Field label="MIDI Channel">
          {(id) => (
            <Dropdown
              inputId={id}
              name="midiIn"
              options={MIDI_CHANNEL_OPTIONS}
              value={value.syncMapChannelStart}
              onChange={(e) => onChange({ syncMapChannelStart: e.value })}
              placeholder="Select channel"
            />
          )}
        </Field>
      </Flex>
    </Card>
  );
};
