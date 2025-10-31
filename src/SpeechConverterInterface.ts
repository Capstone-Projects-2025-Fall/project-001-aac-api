

/**
 * Represents a single transcription log entry.
 * Each entry contains the transcribed text and the time it was captured.
 */
export interface transcribedLogEntry {
  /** The timestamp indicating when the transcription occurred. */
  timestamp: Date;
  /** The text that was transcribed at the given timestamp. */
  transcribedText:string,
}


export interface SpeechConverterInterface {

  init(modelPath: string, lang: string): Promise<void>;

  startListening(): void;

  stopListening(): void;

  getTranscribed():string;

  getLoggedText():string[];

  getStatus(): string;
}
