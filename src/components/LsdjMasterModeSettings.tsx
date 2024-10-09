import { Flex } from "./Flex";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { Callback } from "../types";
import { Settings } from "../lib/settings";
import { Field } from "./Field";
import { MIDI_CHANNEL_OPTIONS, UNKNOWN_CHANNEL } from "../lib/globals";

type LsdjMasterModeSettingsValue = Pick<Settings, "lsdjMasterModeChannel">;

const DEFAULT_VALUE: LsdjMasterModeSettingsValue = {
  lsdjMasterModeChannel: UNKNOWN_CHANNEL,
};

export const LsdjMasterModeSettings: React.FC<{
  value: LsdjMasterModeSettingsValue | undefined;
  onChange: Callback<LsdjMasterModeSettingsValue>;
}> = ({ value = DEFAULT_VALUE, onChange }) => {
  return (
    <Card title="LSDJ Master Mode Settings">
      <Flex row align="center">
        <Field label="MIDI Channel">
          {(id) => (
            <Dropdown
              inputId={id}
              name="midiIn"
              options={MIDI_CHANNEL_OPTIONS}
              value={value}
              onChange={(e) => onChange({ lsdjMasterModeChannel: e.value })}
              placeholder="CH"
            />
          )}
        </Field>
      </Flex>
    </Card>
  );
};
