import { Callback, Task } from "../types";
import { Settings } from "./settings";

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

const MSG_SETTINGS_SET = 70;
const MSG_SETTINGS_GET = 76;
// const MSG_SETTINGS_RESET = 71;
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
  input: MIDIInput,
  output: MIDIOutput
): Promise<{ settingsData: Uint8Array; disconnect: Task }> {
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

export async function setSettings(
  input: MIDIInput,
  output: MIDIOutput,
  settings: Settings
): Promise<Uint8Array> {
  output.send(msgSetSettings(toSettingsByteArray(settings)));
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
// const msgResetSettings = () => message([MSG_SETTINGS_RESET]);
// const msgGetMode = () => message([MSG_MODE_GET]);
// const msgSetMode = (mode: number) => message([MSG_MODE_SET, mode]);
const msgSetSettings = (settings: Uint8Array) =>
  message([MSG_SETTINGS_SET, ...settings]);

function toSettingsByteArray(settings: Settings): Uint8Array {
  return new Uint8Array([
    // these bytes not included in MSG_SETTINGS_SET
    // 0x7f,
    // settings.versionMajor,
    // settings.versionMinor,
    // 0x7f, //memory init check

    settings.forceMode, //force mode (forces lsdj to be sl)
    settings.mode, //mode

    settings.lsdjSlaveModeChannel, //sync effects midi channel (0-15 = 1-16)
    settings.lsdjMasterModeChannel, //masterNotePositionMidiChannel - LSDJ in master mode will send its song position on the start button via midi note. (0-15 = 1-16)

    settings.kbInstrumentMidiChannel, //keyboardInstrumentMidiChannel - midi channel for keyboard instruments in lsdj. (0-15 = 1-16)
    settings.kbCompatMode ? 1 : 0, //Keyboard Compatability Mode
    1, //Set to true if you want to have midi channel set the instrument number / doesnt do anything anymore

    //midiOutNoteMessageChannels - midi channels for lsdj midi out note messages Default: channels 1,2,3,4
    settings.lsdjMidiOut.channels[0].noteChannel,
    settings.lsdjMidiOut.channels[1].noteChannel,
    settings.lsdjMidiOut.channels[2].noteChannel,
    settings.lsdjMidiOut.channels[3].noteChannel,

    //midiOutCCMessageChannels - midi channels for lsdj midi out CC messages Default: channels 1,2,3,4
    settings.lsdjMidiOut.channels[0].ccChannel,
    settings.lsdjMidiOut.channels[1].ccChannel,
    settings.lsdjMidiOut.channels[2].ccChannel,
    settings.lsdjMidiOut.channels[3].ccChannel,

    //midiOutCCMode - CC Mode, 0=use 1 midi CC, with the range of 00-6F, 1=uses 7 midi CCs with the
    //range of 0-F (the command's first digit would be the CC#), either way the value is scaled to 0-127 on output
    settings.lsdjMidiOut.channels[0].ccMode,
    settings.lsdjMidiOut.channels[1].ccMode,
    settings.lsdjMidiOut.channels[2].ccMode,
    settings.lsdjMidiOut.channels[3].ccMode,

    //midiOutCCScaling - CC Scaling- Setting to 1 scales the CC value range to 0-127 as oppose to lsdj's incomming 00-6F (0-112) or 0-F (0-15)
    settings.lsdjMidiOut.channels[0].ccScaling ? 1 : 0,
    settings.lsdjMidiOut.channels[1].ccScaling ? 1 : 0,
    settings.lsdjMidiOut.channels[2].ccScaling ? 1 : 0,
    settings.lsdjMidiOut.channels[3].ccScaling ? 1 : 0,

    // midiOutCCMessageNumbers - CC numbers for lsdj midi out, if CCMode is 1, all 7 ccs are used per channel at the cost of a limited resolution of 0-F
    //pu1:
    settings.lsdjMidiOut.channels[0].ccMessageNumbers[0],
    settings.lsdjMidiOut.channels[0].ccMessageNumbers[1],
    settings.lsdjMidiOut.channels[0].ccMessageNumbers[2],
    settings.lsdjMidiOut.channels[0].ccMessageNumbers[3],
    settings.lsdjMidiOut.channels[0].ccMessageNumbers[4],
    settings.lsdjMidiOut.channels[0].ccMessageNumbers[5],
    settings.lsdjMidiOut.channels[0].ccMessageNumbers[6],

    //pu2:
    settings.lsdjMidiOut.channels[1].ccMessageNumbers[0],
    settings.lsdjMidiOut.channels[1].ccMessageNumbers[1],
    settings.lsdjMidiOut.channels[1].ccMessageNumbers[2],
    settings.lsdjMidiOut.channels[1].ccMessageNumbers[3],
    settings.lsdjMidiOut.channels[1].ccMessageNumbers[4],
    settings.lsdjMidiOut.channels[1].ccMessageNumbers[5],
    settings.lsdjMidiOut.channels[1].ccMessageNumbers[6],
    //wav:
    settings.lsdjMidiOut.channels[2].ccMessageNumbers[0],
    settings.lsdjMidiOut.channels[2].ccMessageNumbers[1],
    settings.lsdjMidiOut.channels[2].ccMessageNumbers[2],
    settings.lsdjMidiOut.channels[2].ccMessageNumbers[3],
    settings.lsdjMidiOut.channels[2].ccMessageNumbers[4],
    settings.lsdjMidiOut.channels[2].ccMessageNumbers[5],
    settings.lsdjMidiOut.channels[2].ccMessageNumbers[6],
    //wav:
    settings.lsdjMidiOut.channels[3].ccMessageNumbers[0],
    settings.lsdjMidiOut.channels[3].ccMessageNumbers[1],
    settings.lsdjMidiOut.channels[3].ccMessageNumbers[2],
    settings.lsdjMidiOut.channels[3].ccMessageNumbers[3],
    settings.lsdjMidiOut.channels[3].ccMessageNumbers[4],
    settings.lsdjMidiOut.channels[3].ccMessageNumbers[5],
    settings.lsdjMidiOut.channels[3].ccMessageNumbers[6],

    //mGB midi channels (0-15 = 1-16)
    settings.mgbChannels[0],
    settings.mgbChannels[1],
    settings.mgbChannels[2],
    settings.mgbChannels[3],
    settings.mgbChannels[4],

    //sync map midi channel start (0-15 = 1-16) (for song rows 0x80 to 0xFF it's this channel plus 1)
    settings.syncMapChannelStart,

    //midiout bit check delay & bit check delay multiplier
    settings.lsdjMidiOut.bitCheck.delay,
    settings.lsdjMidiOut.bitCheck.multiplier,

    //midiout byte received delay & byte received delay multiplier
    settings.lsdjMidiOut.byteReceived.delay,
    settings.lsdjMidiOut.byteReceived.multiplier,
  ]);
}
