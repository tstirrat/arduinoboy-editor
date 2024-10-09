import { Flex } from "./Flex";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { Callback } from "../types";
import { Settings } from "../lib/settings";
import { Field } from "./Field";
import { MIDI_CHANNEL_OPTIONS, UNKNOWN_CHANNEL } from "../lib/globals";

type LsdjSlaveModeSettingsValue = Pick<Settings, "lsdjSlaveModeChannel">;

const DEFAULT_VALUE: LsdjSlaveModeSettingsValue = {
  lsdjSlaveModeChannel: UNKNOWN_CHANNEL,
};

export const LsdjSlaveModeSettings: React.FC<{
  value: LsdjSlaveModeSettingsValue | undefined;
  onChange: Callback<LsdjSlaveModeSettingsValue>;
}> = ({ value = DEFAULT_VALUE, onChange }) => {
  return (
    <Card title="LSDJ Slave Mode Settings">
      <Flex row align="center">
        <Field label="MIDI Channel">
          {(id) => (
            <Dropdown
              inputId={id}
              name="midiIn"
              options={MIDI_CHANNEL_OPTIONS}
              value={value.lsdjSlaveModeChannel}
              onChange={(e) => onChange({ lsdjSlaveModeChannel: e.value })}
              placeholder="CH"
            />
          )}
        </Field>
      </Flex>
    </Card>
  );
};
