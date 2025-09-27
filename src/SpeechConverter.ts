import createWhisperModule, { WhisperModule } from "./whisper/libstream";
import { AudioInputHandler } from "./AudioInputHandler";

 //whisper functions:
 //init (string urlToPath, string: langCode)//return number
 //free (int index)//void
 //set_audio (int index, JS Array) //number
 //get_transcribed ()string
 //get_status() string
 //set_status(string status) void //status =
 //

export class SpeechConverter{

    private whisper:WhisperModule | null = null;
    private audioHandler: AudioInputHandler | null = null;


    constructor(){
        //  
    }

private async loadModelToFS(modelPath: string) {
    if (!this.whisper) throw new Error("Whisper module not initialized");
    console.log("inside loadModel");

    const res = await fetch(modelPath);
    if (!res.ok) throw new Error(`Failed to fetch model: ${res.status}`);
    const buffer = await res.arrayBuffer();
    const uint8 = new Uint8Array(buffer);

    console.log("First 8 bytes of model:", uint8.slice(0, 8));


    // Make a directory and write file into MEMFS
    this.whisper.FS_createPath("/", "models", true, true);
    this.whisper.FS_createDataFile("/models", "whisper-model.bin", uint8, true, true);
    console.log("at end of loadModel");
}


  async init(modelPath: string, lang: string) {
    this.whisper = await createWhisperModule();

    //load path into virtual filesystem
    await this.loadModelToFS(modelPath);
    //
    const result = this.whisper.init("/models/whisper-model.bin",lang);
    console.log(Object.keys(this.whisper));
    //debugging to see if it initializes
    if(result === 0){
        throw new Error(`Did not initialize whisper ${result}`);
    }else{
        console.log("whisper initialized: ",this.whisper);
    }

  }

  startPolling(interval: number = 1000){
    if(!this.whisper) throw new Error("whisper not initialized");
  
  const poller = setInterval(() => {
    const status = this.whisper!.get_status();
    if(status.includes("waiting for audio")){
      const text = this.whisper!.get_transcribed();
      if(text && text.length >0){
        console.log("transcribed: ", text);
      }
    }else{
      console.log("current status: ", status);
    }
  }, interval);
  return poller;
}




  startListening(){
    if(!this.whisper) throw new Error("Call init() first");

      const inputSampleRate = this.audioHandler?.getCtx()?.sampleRate || 44100;
  const targetSampleRate = 16000;
  const bufferSeconds = 2;
  const oneBlockSamples = inputSampleRate * bufferSeconds;

  let buffer: Float32Array[] = [];
  let bufferLength = 0;

  const downsample = (input: Float32Array, inputRate: number, outputRate: number) => {
    if (inputRate === outputRate) return input;
    const ratio = inputRate / outputRate;
    const newLength = Math.floor(input.length / ratio);
    const result = new Float32Array(newLength);
    let offsetResult = 0;
    let offsetInput = 0;

    while (offsetResult < newLength) {
      const nextOffset = Math.floor((offsetResult + 1) * ratio);
      let sum = 0;
      let count = 0;
      for (let i = Math.floor(offsetInput); i < nextOffset && i < input.length; i++) {
        sum += input[i];
        count++;
      }
      result[offsetResult] = count > 0 ? sum / count : 0;
      offsetResult++;
      offsetInput = nextOffset;
    }

    return result;
  };

      this.audioHandler = new AudioInputHandler((chunk: Float32Array) => {
     
        buffer.push(chunk);
    bufferLength += chunk.length;

    while (bufferLength >= oneBlockSamples) {
      const combined = new Float32Array(oneBlockSamples);
      let offset = 0;

      while (offset < oneBlockSamples && buffer.length > 0) {
        const currentChunk = buffer[0];
        const needed = oneBlockSamples - offset;

        if (currentChunk.length <= needed) {
          combined.set(currentChunk, offset);
          offset += currentChunk.length;
          buffer.shift();
        } else {
          combined.set(currentChunk.subarray(0, needed), offset);
          buffer[0] = currentChunk.subarray(needed);
          offset += needed;
        }
      }

      bufferLength -= oneBlockSamples;

      // Downsample to 16kHz and send to Whisper
      const downsampled = downsample(combined, inputSampleRate, targetSampleRate);
    
        
        
        
        
        
        
        
        
        this.whisper?.set_audio(1, downsampled);
    }
    });

    this.audioHandler.startListening();
  }

  setAudio(index: number, audio: Float32Array | number[]): number {
    if (!this.whisper) {
      throw new Error("Whisper module not initialized. Call init() first.");
    }
    return this.whisper.set_audio(index, audio);
  }

  getTranscribed(): string {
    if (!this.whisper) {
      throw new Error("Whisper module not initialized. Call init() first.");
    }


    let status = this.whisper?.get_status();
    console.log(status);
    let text = this.whisper.get_transcribed();
    if(text && text.length >0){
    return this.whisper.get_transcribed();
    }else{
        return "did not get transcription: "+status;
    }
    
  }

  getStatus(): string {
    if (!this.whisper) {
      return "loading";
    }
    return this.whisper.get_status();
  }

}