import { Callback, Task } from "../types";

const MAJOR_VERSION = 0x01;
const MINOR_VERSION = 0x03;

const MIDI_STATUS_SYSEX = 0xf0;
const SYSEX_EOF = 0xf7;

const SYSEX_ABOY_ID = 0x69;

const MSG_TYPE = 2;

const MSG_CONNECT = 72;
const MSG_HEARTBEAT = 0x7f;
const MSG_CONNECT_REQ = 64;
const MSG_CONNECT_REQ_ACK = 65;
const MSG_CONNECTED = 66;

const MSG_SETTINGS = 0x40;

// const MSG_SETTNGS_SET = 70;
const MSG_SETTINGS_GET = 71;
const MSG_MODE_GET = 73;
// const MSG_MODE_SET = 74;
// const MSG_MIDI_OUT_DELAY_SET = 75;

function sysexMessage(message: number[]) {
  return [MIDI_STATUS_SYSEX, ...message, SYSEX_EOF];
}

export function toHex(message: number[]) {
  return message.map((b) => b.toString(16));
}

export function toHexWithPrefix(message: number[]) {
  return message.map((b) => "0x" + b.toString(16));
}

function message(message: number[]) {
  return sysexMessage([SYSEX_ABOY_ID, ...message]);
}

export async function connect(
  midi: MIDIAccess,
  outputName: string,
  inputName: string
): Promise<{ settingsData: Uint8Array; disconnect: Task }> {
  if (!midi) throw new Error("MIDI is not ready");
  if (!outputName) throw new Error("You must select a port");

  const output = [...midi.outputs.values()].find((o) => o.name === outputName);
  if (!output) throw new Error(`Out port not found ${outputName}`);

  const input = [...midi.inputs.values()].find((o) => o.name === inputName);
  if (!input) throw new Error(`In port not found ${inputName}`);

  output.send(msgConnect());

  const [, , , major, minor] = await waitFor(input, MSG_HEARTBEAT);

  checkVersion(major, minor);

  output.send(msgRequestConnection());
  await waitFor(input, MSG_CONNECT_REQ_ACK);

  output.send(msgKeepalive());
  const settingsData = await waitFor(input, MSG_SETTINGS);

  const disconnect = handleMessage(input, MSG_HEARTBEAT, () => {
    output.send(msgKeepalive());
  });

  return { settingsData, disconnect };
}

function checkVersion(major: number, minor: number) {
  if (major !== MAJOR_VERSION && minor !== MINOR_VERSION) {
    console.warn(
      `Version mismatch: Seen ${major}.${minor} expected: ${MAJOR_VERSION}.${MINOR_VERSION}`
    );
  }
}

export async function getSettings(
  input: MIDIInput,
  output: MIDIOutput
): Promise<Uint8Array> {
  output.send(msgGetSettings());
  return waitFor(input, MSG_SETTINGS);
}

export async function getMode(
  input: MIDIInput,
  output: MIDIOutput
): Promise<Uint8Array> {
  output.send(msgGetSettings());
  return waitFor(input, MSG_MODE_GET);
}

async function waitFor(input: MIDIInput, type: number): Promise<Uint8Array> {
  return new Promise((resolve) => {
    handleMessageOnce(input, type, (message) => {
      resolve(message.data ?? new Uint8Array());
    });
  });
}

function handleMessage(
  input: MIDIInput,
  type: number,
  callback: Callback<MIDIMessageEvent>
) {
  const handler = (message: MIDIMessageEvent) => {
    const messageType = message.data && message.data[MSG_TYPE];
    // console.log("handleMessage saw message", messageType, message);
    // console.log("handleMessage waiting for type", type, messageType === type);

    if (messageType == type) {
      // console.log("handleMessage resolving with", message.data);
      callback(message);
    }
  };

  // console.log("handleMessage waiting for: ", type.toString(0xf));
  input.addEventListener("midimessage", handler);

  const disconnect = () => {
    input.removeEventListener("midimessage", handler);
  };
  return disconnect;
}

function handleMessageOnce(
  input: MIDIInput,
  type: number,
  callback: Callback<MIDIMessageEvent>
) {
  const handler = (message: MIDIMessageEvent) => {
    const messageType = message.data && message.data[MSG_TYPE];
    // console.log("handleMessageOnce saw message", messageType, message);
    // console.log("handleMessageOnce waiting for type", type, messageType === type);

    if (messageType == type) {
      input.removeEventListener("midimessage", handler);
      // console.log("handleMessageOnce resolving with", message.data);
      callback(message);
    }
  };

  // console.log("handleMessageOnce waiting for: ", type.toString(0xf));
  input.addEventListener("midimessage", handler);
}

const msgConnect = () => message([MSG_CONNECT]);
const msgRequestConnection = () =>
  message([MSG_CONNECT_REQ, MAJOR_VERSION, MINOR_VERSION]);
const msgKeepalive = () =>
  message([MSG_CONNECTED, MAJOR_VERSION, MINOR_VERSION]);
const msgGetSettings = () => message([MSG_SETTINGS_GET]);
// const msgGetMode = () => message([MSG_MODE_GET]);
// const msgSetMode = (mode: number) => message([MSG_MODE_SET, mode]);
// const msgSetSettings = (settings: Uint8Array) =>
//   message([MSG_SETTNGS_SET, ...settings]);
