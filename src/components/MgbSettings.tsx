import { Flex } from "./Flex";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { Callback } from "../types";
import { Settings } from "../lib/settings";
import { MIDI_CHANNEL_OPTIONS, UNKNOWN_CHANNEL } from "../lib/globals";

const SYNTHS = [
  { label: "PU1 Channel" },
  { label: "PU2 Channel" },
  { label: "WAV Channel" },
  { label: "NOI Channel" },
  { label: "POLY Channel" },
];

const DEFAULT_VALUE: MgbSettingsValue = {
  mgbChannels: [
    UNKNOWN_CHANNEL,
    UNKNOWN_CHANNEL,
    UNKNOWN_CHANNEL,
    UNKNOWN_CHANNEL,
    UNKNOWN_CHANNEL,
  ],
};

export type MgbSettingsValue = Pick<Settings, "mgbChannels">;

export const MgbSettings: React.FC<{
  value: MgbSettingsValue | undefined;
  onChange: Callback<MgbSettingsValue>;
}> = ({ value = DEFAULT_VALUE, onChange }) => {
  const handleChange = (i: number, val: number) => {
    const newChannels: MgbSettingsValue["mgbChannels"] = [...value.mgbChannels];

    newChannels[i] = val;

    onChange({ mgbChannels: newChannels });
  };

  return (
    <Card title="mGB MIDI Settings">
      <Flex row align="center">
        {SYNTHS.map((synth, i) => (
          <ChannelSelect
            key={synth.label}
            label={synth.label}
            value={value.mgbChannels[i]}
            onChange={(val) => handleChange(i, val)}
          />
        ))}
      </Flex>
    </Card>
  );
};

const ChannelSelect: React.FC<{
  label: string;
  value: number;
  onChange: Callback<number>;
}> = ({ label, value, onChange }) => {
  return (
    <Flex col align="center">
      <label>{label}</label>
      <Dropdown
        name="pu1"
        options={MIDI_CHANNEL_OPTIONS}
        value={value}
        onChange={(e) => onChange(e.value)}
        placeholder="Channel"
      />
    </Flex>
  );
};
