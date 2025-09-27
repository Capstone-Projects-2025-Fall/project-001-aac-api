import createWhisperModule from "./whisper/libstream.js";
import type { WhisperModule } from "./whisper/libstream.js";
import { AudioInputHandler } from "./AudioInputHandler.js";
import { resample } from 'wave-resampler';

 //whisper functions:
 //init (string urlToPath, string: langCode)//return number
 //free (int index)//void
 //set_audio (int index, JS Array) //number
 //get_transcribed ()string
 //get_status() string
 //set_status(string status) void //status =
 //



export default class SpeechConverter {
  private whisperModule: WhisperModule | null = null;
  private audioHandler: AudioInputHandler | null = null;
  

  constructor() {

    this.audioHandler = new AudioInputHandler((chunk: Float32Array) => {
      this.processChunk(chunk);
    });
  }


  //convert to correct data stream



  private processChunk(chunk:Float32Array):void{
    let originalSample = 48000;
    let downSample = 16000;
    console.log("chunk before: ", chunk);
    let newSamples = resample(chunk,originalSample,downSample);

    console.log("After sampling", newSamples);

  }


 //TODO:
 //create a data stream that is accepted by whisper
 //initialize whisper
 //call the get transcribed function

 async init(modelPath: string, lang: string): Promise<void>{
  if(!this.whisperModule){
    this.whisperModule = await createWhisperModule();
  }
  const result = this.whisperModule.init(modelPath,lang);

  if(result === 0){
    throw new Error('Whisper failed to initialize with code ${result}');
  }
  console.log("whisper id: ",result);
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
