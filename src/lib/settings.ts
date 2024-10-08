export type Settings = {
  // rubbish 0x7F,
  versionMajor: number;
  versionMinor: number;
  // rubbish 0x7F,

  /** force mode (forces lsdj to be sl) */
  forceMode: number;

  /** mode */
  mode: number;

  /** sync effects midi channel (0-15 = 1-16) */
  syncEffectsMidiChannel: number;

  /** masterNotePositionMidiChannel - LSDJ in master mode will send its song position on the start button via midi note. (0-15 = 1-16) */
  masterNotePositionMidiChannel: number;

  /** keyboardInstrumentMidiChannel - midi channel for keyboard instruments in lsdj. (0-15 = 1-16) */
  kbInstrumentMidiChannel: number;

  /** Keyboard Compatability Mode */
  kbCompatMode: boolean;

  // Set to true if you want to have midi channel set the instrument number / doesnt do anything anymore
  // unused: number;

  /** midiOutNoteMessageChannels - midi channels for lsdj midi out note messages Default: channels 1,2,3,4 */
  midiOutNoteMessageChannels: [number, number, number, number];

  /** midiOutCCMessageChannels - midi channels for lsdj midi out CC messages Default: channels 1,2,3,4 */
  midiOutCCMessageChannels: [number, number, number, number];

  /** midiOutCCMode - CC Mode, 0=use 1 midi CC, with the range of 00-6F, 1=uses 7 midi CCs with the */
  midiOutCCMode: [number, number, number, number];

  /** range of 0-F (the command's first digit would be the CC#), either way the value is scaled to 0-127 on output */
  /** midiOutCCScaling - CC Scaling- Setting to 1 scales the CC value range to 0-127 as oppose to lsdj's incomming 00-6F (0-112) or 0-F (0-15) */
  midiOutCCScaling: [number, number, number, number];

  /**  midiOutCCMessageNumbers - CC numbers for lsdj midi out, if CCMode is 1, all 7 ccs are used per channel at the cost of a limited resolution of 0-F */
  midiOutCCMessageNumbers: {
    //pu1:
    pu1: [number, number, number, number, number, number, number];
    //pu2
    pu2: [number, number, number, number, number, number, number];
    //wav
    wav: [number, number, number, number, number, number, number];
    //noi
    noi: [number, number, number, number, number, number, number];
  };

  /** mGB midi channels (0-15 = 1-16) */
  mgbChannels: [number, number, number, number, number];

  /** sync map midi channel start (0-15 = 1-16) (for song rows 0x80 to 0xFF it's this channel plus 1) */
  syncMapChannelStart: number;

  /** midiout bit check delay & bit check delay multiplier */
  miditOutBitCheckDelay: [number, number];

  /** midiout byte received delay & byte received delay multiplier */
  midiOutByteReceived: [number, number];
};

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
    syncEffectsMidiChannel, //sync effects midi channel (0-15 = 1-16)
    masterNotePositionMidiChannel, // - LSDJ in master mode will send its song position on the start button via midi note. (0-15 = 1-16)
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
    syncEffectsMidiChannel,
    masterNotePositionMidiChannel,
    kbInstrumentMidiChannel,
    kbCompatMode: !!kbCompatMode,
    midiOutCCScaling: [
      midiOutCCScaling_0,
      midiOutCCScaling_1,
      midiOutCCScaling_2,
      midiOutCCScaling_3,
    ],
    midiOutCCMessageChannels: [
      midiOutCCMessageChannel_0,
      midiOutCCMessageChannel_1,
      midiOutCCMessageChannel_2,
      midiOutCCMessageChannel_3,
    ],
    midiOutCCMode: [
      midiOutCCMode_0,
      midiOutCCMode_1,
      midiOutCCMode_2,
      midiOutCCMode_3,
    ],
    midiOutNoteMessageChannels: [
      midiOutNoteMessageChannel_0,
      midiOutNoteMessageChannel_1,
      midiOutNoteMessageChannel_2,
      midiOutNoteMessageChannel_3,
    ],
    midiOutCCMessageNumbers: {
      pu1: [
        midiOutCCMessagePu1_0,
        midiOutCCMessagePu1_1,
        midiOutCCMessagePu1_2,
        midiOutCCMessagePu1_3,
        midiOutCCMessagePu1_4,
        midiOutCCMessagePu1_5,
        midiOutCCMessagePu1_6,
      ],
      pu2: [
        midiOutCCMessagePu2_0,
        midiOutCCMessagePu2_1,
        midiOutCCMessagePu2_2,
        midiOutCCMessagePu2_3,
        midiOutCCMessagePu2_4,
        midiOutCCMessagePu2_5,
        midiOutCCMessagePu2_6,
      ],
      wav: [
        midiOutCCMessageWav_0,
        midiOutCCMessageWav_1,
        midiOutCCMessageWav_2,
        midiOutCCMessageWav_3,
        midiOutCCMessageWav_4,
        midiOutCCMessageWav_5,
        midiOutCCMessageWav_6,
      ],
      noi: [
        midiOutCCMessageNoi_0,
        midiOutCCMessageNoi_1,
        midiOutCCMessageNoi_2,
        midiOutCCMessageNoi_3,
        midiOutCCMessageNoi_4,
        midiOutCCMessageNoi_5,
        midiOutCCMessageNoi_6,
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
    midiOutByteReceived: [midiOutByteReceived_0, midiOutByteReceived_1],
    miditOutBitCheckDelay: [miditOutBitCheckDelay0, miditOutBitCheckDelay1],
  };
}
