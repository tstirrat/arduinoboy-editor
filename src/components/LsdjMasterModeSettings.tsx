import { Flex } from "./Flex";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { Callback } from "../types";
import { Settings } from "../lib/settings";
import { Field } from "./Field";
import { MIDI_CHANNEL_OPTIONS, UNKNOWN_CHANNEL } from "../lib/globals";

export const LsdjMasterModeSettings: React.FC<{
  value: Settings["lsdjMasterModeChannel"] | undefined;
  onChange: Callback<Settings["lsdjMasterModeChannel"]>;
}> = ({ value = UNKNOWN_CHANNEL, onChange }) => {
  return (
    <Card title="LSDJ Master Mode Settings">
      <Flex row align="center" gap={8}>
        <Field label="MIDI Channel">
          {(id) => (
            <Dropdown
              inputId={id}
              name="midiIn"
              options={MIDI_CHANNEL_OPTIONS}
              value={value}
              onChange={(e) => onChange(e.value)}
              placeholder="Select port"
            />
          )}
        </Field>
      </Flex>
    </Card>
  );
};
