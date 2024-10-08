import { useEffect, useMemo, useState } from "react";

export function useMidiPermission() {
  const [granted, setGranted] = useState<PermissionState | undefined>(
    undefined
  );

  (async () => {
    try {
      const { state } = await navigator.permissions.query({
        name: "midi",
        sysex: true,
      } as unknown as PermissionDescriptor); // TODO: fix this?
      setGranted(state);
    } catch (e) {
      console.error(`Failed to get MIDI permission`, e);
    }
  })();

  return granted;
}

function useMidiAccess() {
  const [midi, setMidi] = useState<MIDIAccess | undefined>(undefined);

  useEffect(() => {
    (async () => {
      try {
        const midiAccess = await navigator.requestMIDIAccess({ sysex: true });
        setMidi(midiAccess);
      } catch (e) {
        console.error(`Failed to get MIDI access`, e);
      }
    })();
  }, []);

  return midi;
}

export function useMidiPortNames() {
  const midi = useMidiAccess();

  const outputs = useMemo(() => {
    if (!midi) return [];

    return [...midi.outputs.values()].map((o) => o.name);
  }, [midi]);

  const inputs = useMemo(() => {
    if (!midi) return [];

    return [...midi.inputs.values()].map((o) => o.name);
  }, [midi]);

  return { midi, inputs, outputs };
}
