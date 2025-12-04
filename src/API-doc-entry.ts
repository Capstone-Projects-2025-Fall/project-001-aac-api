export { CommandConverter } from './CommandConverter';
export { CommandLogEntry, CommandHistory } from './CommandHistory';
export { AACVoiceAPI, voiceAPIConfig } from './AACVoiceAPI';
export { AudioInputHandler } from './AudioInputHandler';
export { GameCommand, CommandLibrary } from './commandLibrary';
export { showHistoryPopup } from './showHistoryPopup';
export {
  SpeechConverterInterface,
  transcribedLogEntry,
  TranscriptionResponse,
} from './SpeechConverterInterface';
export { SpeechConverterOffline } from './SpeechConverterOffline';
export { SpeechConverterOnline } from './SpeechConverterOnline';
export { SynonymResolver } from './SynonymResolver';
export { ConfidenceConfig } from './ConfidenceConfig';

//this file exists solely for the api typedoc automation.
//To add a file to the api automation export it it here.
