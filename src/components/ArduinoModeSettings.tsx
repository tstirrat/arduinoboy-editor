import { Flex } from "./Flex";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { Callback } from "../types";
import { Settings } from "../lib/settings";
import { Field } from "./Field";
import { SelectItem } from "primereact/selectitem";

type ArduinoModeSettingsValue = Pick<Settings, "mode" | "forceMode">;

const UNKNOWN_MODE = 7;

const DEFAULT_VALUE: ArduinoModeSettingsValue = {
  mode: UNKNOWN_MODE,
  forceMode: UNKNOWN_MODE,
};

const MODES = [
  "LSDJ Slave",
  "LSDJ Master",
  "LSDJ PC Keyboard",
  "Nanoloop",
  "MIDI Passthrough (mGB)",
  "LSDJ MIDIMAP",
  "LSDJ MIDIOUT",
  "--", // moce not set/loading
];

const MODE_OPTIONS: SelectItem[] = new Array(8).fill(0).map((_, i) => ({
  label: MODES[i],
  value: i,
}));

export const ArduinoModeSettings: React.FC<{
  value: ArduinoModeSettingsValue | undefined;
  onChange: Callback<ArduinoModeSettingsValue>;
}> = ({ value = DEFAULT_VALUE, onChange }) => {
  const { mode, forceMode } = value;

  return (
    <Card
      title="LSDJ Slave Mode Settings"
      style={{ flexShrink: 1, minWidth: 0 }}
    >
      <Flex row align="center">
        <Field label="Mode" vertical>
          {(id) => (
            <Dropdown
              inputId={id}
              name="mode"
              options={MODE_OPTIONS}
              value={mode}
              onChange={(e) => onChange({ ...value, mode: e.value })}
              placeholder="Select mode"
            />
          )}
        </Field>

        <Field label="Force mode" vertical>
          {(id) => (
            <Dropdown
              disabled
              inputId={id}
              name="midiIn"
              options={MODE_OPTIONS}
              value={forceMode}
              onChange={(e) => onChange({ ...value, forceMode: e.value })}
              placeholder="Select mode"
            />
          )}
        </Field>
      </Flex>
    </Card>
  );
};