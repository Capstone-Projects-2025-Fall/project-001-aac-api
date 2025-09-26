import createWhisperModule from "./whisper/libstream.js";
import type { WhisperModule } from "./whisper/libstream";

export class SpeechConverter {
  private whisperModule: WhisperModule | null = null;
  

  constructor() {}

 //whisper functions:
 //init (string urlToPath, string: langCode)//return number
 //free (int index)//void
 //set_audio (int index, JS Array) //number
 //get_transcribed ()string
 //get_status() string
 //set_status(string status) void //status =
 //

 //TODO:
 //create a data stream that is accepted by whisper
 //initialize whisper
 //call the get transcribed function

 async init(modelPath: string, lang: string): Promise<void>{
  if(!this.whisperModule){
    this.whisperModule = await createWhisperModule();
  }
  const result = this.whisperModule.init(modelPath,lang);

  if(result !== 0){
    throw new Error("Whisper failed to initialize with code ${result}");
  }
 }

  getStatus(): string {
    return this.whisperModule ? this.whisperModule.get_status() : "uninitialized";
  }


  getTranscribed(): string {
    if (!this.whisperModule) throw new Error("Whisper not initialized");
    return this.whisperModule.get_transcribed();
  }
    setAudio(index: number, audio: Float32Array | number[]): number {
    if (!this.whisperModule) throw new Error("Whisper not initialized");
    return this.whisperModule.set_audio(index, audio);
  }

}