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
    private transcribedText: string[] = [];


    constructor(){
        //  
    }


    //loads the model into a virtual filesystem that emscript provides for the wasm file
private async loadModelToFS(modelPath: string) {
    if (!this.whisper) throw new Error("Whisper module not initialized");
    

    const res = await fetch(modelPath);
    if (!res.ok) throw new Error(`Failed to fetch model: ${res.status}`);
    const buffer = await res.arrayBuffer();
    const uint8 = new Uint8Array(buffer);

    


    // Make a directory and write file into MEMFS
    this.whisper.FS_createPath("/", "models", true, true);
    this.whisper.FS_createDataFile("/models", "whisper-model.bin", uint8, true, true);
    
}


  async init(modelPath: string, lang: string) {
    this.whisper = await createWhisperModule();

    //load path into virtual filesystem
    await this.loadModelToFS(modelPath);
    this.whisper.init("/models/whisper-model.bin",lang);
  }


  private downSample(input: Float32Array, inputRate: number, outputRate: number){
    if (inputRate === outputRate) {
      return input;
    }

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
  }


//help
private combineChunks(buffer: Float32Array[], oneBlockSamples: number): Float32Array{

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

  return combined;


}



  startListening(){
    if(!this.whisper) throw new Error("Call init() first");

      const inputSampleRate = this.audioHandler?.getSampleRate() || 48000;//default from browser is 48000
      const targetSampleRate = 16000;//whisper needs it to be this for best results
      const bufferSeconds = 2;//may need to adjust if too short of a time frame 
      const oneBlockSamples = inputSampleRate * bufferSeconds;//creates the block size for x amount of seconds

      let buffer: Float32Array[] = [];
      let bufferLength = 0;

      
  

      this.audioHandler = new AudioInputHandler((chunk: Float32Array) => {
        
        //collects chunks until enough data is recieved
        buffer.push(chunk);
        bufferLength += chunk.length;

      
      while (bufferLength >= oneBlockSamples) {//only send to whisper when enough chunks exist
        
        const combined = this.combineChunks(buffer, oneBlockSamples);
        bufferLength -= oneBlockSamples;

        //this may need to change to an third party api call later as it could be too cpu intensive
        const downsampled = this.downSample(combined, inputSampleRate, targetSampleRate);
    
        
        this.whisper?.set_audio(1, downsampled);
    }
    });

    this.audioHandler.startListening();
  }
  stopListening(){
        if (!this.whisper) {
      throw new Error("Whisper module not initialized. Call init() first.");
    }
    this.audioHandler?.stopListening();
  }

  private setAudio(index: number, audio: Float32Array | number[]): number {
    if (!this.whisper) {
      throw new Error("Whisper module not initialized. Call init() first.");
    }
    return this.whisper.set_audio(index, audio);
  }

  getTranscribed(): string []{
    if (!this.whisper) {
      throw new Error("Whisper module not initialized. Call init() first.");
    }


    //let status = this.whisper?.get_status();
    
    this.transcribedText.push(this.whisper.get_transcribed());

    
    return this.transcribedText;
    
    
  }

  getStatus(): string {
    if (!this.whisper) {
      return "loading";
    }
    return this.whisper.get_status();
  }

}