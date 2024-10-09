import { SelectItemOptionsType } from "primereact/selectitem";

export const UNKNOWN_CHANNEL = 16;
export const MIDI_CHANNEL_OPTIONS: SelectItemOptionsType = new Array(17)
  .fill(0)
  .map((_, i) => ({
    label: i === UNKNOWN_CHANNEL ? "--" : `${i + 1}`,
    value: i,
    disabled: i === UNKNOWN_CHANNEL,
  }));

export const exists = <T>(v: T | undefined | null): v is T => !!v;
