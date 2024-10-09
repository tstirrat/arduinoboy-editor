import { Flex } from "./Flex";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { Callback } from "../types";
import { Settings } from "../lib/settings";
import { Field } from "./Field";
import { MIDI_CHANNEL_OPTIONS, UNKNOWN_CHANNEL } from "../lib/globals";
import { Checkbox } from "primereact/checkbox";

export type KbSettings = Pick<
  Settings,
  "kbInstrumentMidiChannel" | "kbCompatMode"
>;

const DEFAULT_VALUE: KbSettings = {
  kbInstrumentMidiChannel: UNKNOWN_CHANNEL,
  kbCompatMode: false,
};

export const KeyboardModeSettings: React.FC<{
  value: KbSettings | undefined;
  onChange: Callback<KbSettings>;
}> = ({ value = DEFAULT_VALUE, onChange }) => {
  return (
    <Card title="Keyboard Mode Settings">
      <Flex row align="center">
        <Field label="MIDI Channel">
          {(id) => (
            <Dropdown
              inputId={id}
              name="midiIn"
              options={MIDI_CHANNEL_OPTIONS}
              value={value.kbInstrumentMidiChannel}
              onChange={(e) =>
                onChange({ ...value, kbInstrumentMidiChannel: e.value })
              }
              placeholder="Select port"
            />
          )}
        </Field>
        <Checkbox
          title="Test"
          checked={value.kbCompatMode}
          onChange={(e) => onChange({ ...value, kbCompatMode: e.value })}
        />
      </Flex>
    </Card>
  );
};
