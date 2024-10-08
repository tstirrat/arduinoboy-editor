export type Settings = {
  // rubbish 0x7F,
  versionMajor: number;
  versionMinor: number;
  // rubbish 0x7F,

  /** force mode (forces lsdj to be sl) */
  forceMode: number;

  /** mode */
  mode: number;

  /** LSDJ in slave mode MIDI channel. (0-15 = 1-16) */
  lsdjSlaveModeChannel: number;

  /** LSDJ in master mode will send its song position on the start button via midi note. (0-15 = 1-16) */
  lsdjMasterModeChannel: number;

  /** keyboardInstrumentMidiChannel - midi channel for keyboard instruments in lsdj. (0-15 = 1-16) */
  kbInstrumentMidiChannel: number;

  /** Keyboard Compatability Mode */
  kbCompatMode: boolean;

  // Set to true if you want to have midi channel set the instrument number / doesnt do anything anymore
  // unused: number;

  /** LSDJ MIDI Out mode config */
  lsdjMidiOut: {
    /** midiout bit check delay & bit check delay multiplier */
    bitCheck: MidiOutDelay;

    /** midiout byte received delay & byte received delay multiplier */
    byteReceived: MidiOutDelay;

    channels: [MidiOutConfig, MidiOutConfig, MidiOutConfig, MidiOutConfig];
  };

  /** mGB midi channels (0-15 = 1-16) */
  mgbChannels: [number, number, number, number, number];

  /** sync map midi channel start (0-15 = 1-16) (for song rows 0x80 to 0xFF it's this channel plus 1) */
  syncMapChannelStart: number;
};

type MidiOutDelay = { delay: number; multiplier: number };

export type MidiOutConfig = {
  /** midi channel for lsdj midi out note messages */
  noteChannel: number;

  /** midi channel for lsdj midi out CC messages */
  ccChannel: number;

  /**
   * CC Mode, 0=use 1 midi CC, with the range of 00-6F, 1=uses 7 midi CCs with the
   * range of 0-F (the command's first digit would be the CC#), either way the value is scaled to
   * 0-127 on output
   */
  ccMode: LsdjCcMode;

  /**  midiOutCCMessageNumbers - CC numbers for lsdj midi out, if CCMode is 1, all 7 ccs are used per channel at the cost of a limited resolution of 0-F */
  ccMessageNumbers: [number, number, number, number, number, number, number];

  /** CC Scaling- Setting to 1 scales the CC value range to 0-127 as oppose to lsdj's incomming 00-6F (0-112) or 0-F (0-15) */
  ccScaling: boolean;
};

enum LsdjCcMode {
  Single = 0,
  Multiple,
}

export function toSettings(message: Uint8Array): Settings {
  const [
    ,
    ,
    ,
    ,
    // sysex
    // 0x69 aBoy MFG ID
    // MSG_SETTINGS
    // unused 0x7f
    versionMajor,
    versionMinor,
    ,
    forceMode,
    mode,
    lsdjSlaveModeChannel, //sync effects midi channel (0-15 = 1-16)
    lsdjMasterModeChannel, // - LSDJ in master mode will send its song position on the start button via midi note. (0-15 = 1-16)
    kbInstrumentMidiChannel, // - midi channel for keyboard instruments in lsdj. (0-15 = 1-16)
    kbCompatMode,
    ,
    midiOutNoteMessageChannel_0,
    midiOutNoteMessageChannel_1,
    midiOutNoteMessageChannel_2,
    midiOutNoteMessageChannel_3,
    midiOutCCMessageChannel_0,
    midiOutCCMessageChannel_1,
    midiOutCCMessageChannel_2,
    midiOutCCMessageChannel_3,
    midiOutCCMode_0,
    midiOutCCMode_1,
    midiOutCCMode_2,
    midiOutCCMode_3,

    midiOutCCScaling_0,
    midiOutCCScaling_1,
    midiOutCCScaling_2,
    midiOutCCScaling_3,
    midiOutCCMessagePu1_0,
    midiOutCCMessagePu1_1,
    midiOutCCMessagePu1_2,
    midiOutCCMessagePu1_3,
    midiOutCCMessagePu1_4,
    midiOutCCMessagePu1_5,
    midiOutCCMessagePu1_6,
    midiOutCCMessagePu2_0,
    midiOutCCMessagePu2_1,
    midiOutCCMessagePu2_2,
    midiOutCCMessagePu2_3,
    midiOutCCMessagePu2_4,
    midiOutCCMessagePu2_5,
    midiOutCCMessagePu2_6,
    midiOutCCMessageWav_0,
    midiOutCCMessageWav_1,
    midiOutCCMessageWav_2,
    midiOutCCMessageWav_3,
    midiOutCCMessageWav_4,
    midiOutCCMessageWav_5,
    midiOutCCMessageWav_6,
    midiOutCCMessageNoi_0,
    midiOutCCMessageNoi_1,
    midiOutCCMessageNoi_2,
    midiOutCCMessageNoi_3,
    midiOutCCMessageNoi_4,
    midiOutCCMessageNoi_5,
    midiOutCCMessageNoi_6,

    mgbChannelPu1,
    mgbChannelPu2,
    mgbChannelWav,
    mgbChannelNoi,
    mgbChannelPoly,
    syncMapChannelStart,
    miditOutBitCheckDelay0,
    miditOutBitCheckDelay1,
    midiOutByteReceived_0,
    midiOutByteReceived_1,
  ] = message;

  return {
    versionMajor,
    versionMinor,
    forceMode,
    mode,
    lsdjSlaveModeChannel: lsdjSlaveModeChannel,
    lsdjMasterModeChannel,
    kbInstrumentMidiChannel,
    kbCompatMode: !!kbCompatMode,
    lsdjMidiOut: {
      bitCheck: {
        delay: miditOutBitCheckDelay0,
        multiplier: miditOutBitCheckDelay1,
      },
      byteReceived: {
        delay: midiOutByteReceived_0,
        multiplier: midiOutByteReceived_1,
      },
      channels: [
        {
          noteChannel: midiOutNoteMessageChannel_0,
          ccChannel: midiOutCCMessageChannel_0,
          ccMode: midiOutCCMode_0,
          ccScaling: !!midiOutCCScaling_0,
          ccMessageNumbers: [
            midiOutCCMessagePu1_0,
            midiOutCCMessagePu1_1,
            midiOutCCMessagePu1_2,
            midiOutCCMessagePu1_3,
            midiOutCCMessagePu1_4,
            midiOutCCMessagePu1_5,
            midiOutCCMessagePu1_6,
          ],
        },
        {
          noteChannel: midiOutNoteMessageChannel_1,
          ccChannel: midiOutCCMessageChannel_1,
          ccMode: midiOutCCMode_1,
          ccScaling: !!midiOutCCScaling_1,
          ccMessageNumbers: [
            midiOutCCMessagePu2_0,
            midiOutCCMessagePu2_1,
            midiOutCCMessagePu2_2,
            midiOutCCMessagePu2_3,
            midiOutCCMessagePu2_4,
            midiOutCCMessagePu2_5,
            midiOutCCMessagePu2_6,
          ],
        },
        {
          noteChannel: midiOutNoteMessageChannel_2,
          ccChannel: midiOutCCMessageChannel_2,
          ccMode: midiOutCCMode_2,
          ccScaling: !!midiOutCCScaling_2,
          ccMessageNumbers: [
            midiOutCCMessageWav_0,
            midiOutCCMessageWav_1,
            midiOutCCMessageWav_2,
            midiOutCCMessageWav_3,
            midiOutCCMessageWav_4,
            midiOutCCMessageWav_5,
            midiOutCCMessageWav_6,
          ],
        },
        {
          noteChannel: midiOutNoteMessageChannel_3,
          ccChannel: midiOutCCMessageChannel_3,
          ccMode: midiOutCCMode_3,
          ccScaling: !!midiOutCCScaling_3,
          ccMessageNumbers: [
            midiOutCCMessageNoi_0,
            midiOutCCMessageNoi_1,
            midiOutCCMessageNoi_2,
            midiOutCCMessageNoi_3,
            midiOutCCMessageNoi_4,
            midiOutCCMessageNoi_5,
            midiOutCCMessageNoi_6,
          ],
        },
      ],
    },
    mgbChannels: [
      mgbChannelPu1,
      mgbChannelPu2,
      mgbChannelWav,
      mgbChannelNoi,
      mgbChannelPoly,
    ],
    syncMapChannelStart,
  };
}
