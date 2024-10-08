import { useState } from "react";
import { Flex } from "./Flex";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { SelectItem } from "primereact/selectitem";
import { Callback } from "../types";
import { Settings } from "../lib/settings";

const MIDI_CHANNELS: SelectItem[] = new Array(16).fill(0).map((_, i) => ({
  label: `${i + 1}`,
  value: i,
}));

const SYNTHS = [
  { label: "PU1 Channel" },
  { label: "PU2 Channel" },
  { label: "WAV Channel" },
  { label: "NOI Channel" },
  { label: "POLY Channel" },
];

const DEFAULT_MAPPING = [0, 0, 0, 0, 0];

export const MgbSettings: React.FC<{
  settings: Settings | undefined;
}> = ({ settings }) => {
  const [channelConfig, setChannelConfig] = useState(
    settings?.mgbChannels ?? DEFAULT_MAPPING
  );
  return (
    <Card title="mGB MIDI Settings">
      <Flex row align="center" gap={8}>
        {SYNTHS.map((s, i) => (
          <ChannelSelect
            key={s.label}
            label={s.label}
            value={channelConfig[i]}
            onChange={(channel) =>
              setChannelConfig((c) => {
                const clone = [...c];
                clone[i] = channel;
                return clone;
              })
            }
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
        options={MIDI_CHANNELS}
        value={value}
        onChange={(e) => onChange(e.value)}
        placeholder="Channel"
      />
    </Flex>
  );
};
