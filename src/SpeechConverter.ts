import createWhisperModule, { WhisperModule } from "./whisper/libstream";
import { AudioInputHandler } from "./AudioInputHandler";
import { CommandConverter } from "./CommandConverter";

/**
 * An object that holds each transcribed text and a timestamp it was transcribed
 */
export interface transcribedLogEntry {
  timestamp: Date;
  transcribedText:string,
}


/**
 * SpeechConverter handles real-time speech-to-text conversion using the Whisper model.
 * It manages audio input, preprocessing, and transcription directly in the browser.
 * 
 */

export class SpeechConverter{
  /** Reference to the WhisperModule instance for transcribing data */
  private whisper:WhisperModule | null = null;
  /** Used to capture microphone input */
  private audioHandler: AudioInputHandler | null = null;
  /** Processes transcribed text and matches commands */
  private commandConverter: CommandConverter | null = null;
  /**  Keeps a log of all text that has been transcribed*/
  private textLog: transcribedLogEntry[] | null = null;
  private transcriptionInterval?: ReturnType<typeof setInterval>;

  constructor(){
        this.commandConverter = CommandConverter.getInstance(); 
    }


/**
 * Loads a Whisper model from a given path (local or remote) into the in-memory file system.
 *
 * Fetches the model file, writes it into the MEMFS, and returns the internal path
 * where the model is stored for later use by the Whisper instance.
 *
 * @private
 * @param {string} modelPath - The path or URL to the model file to load.
 * @returns {Promise<string>} - The internal file path in MEMFS where the model is stored.
 * @throws {Error} Throws if the Whisper module is not initialized or fetch fails.
 */
private async loadModelToFS(modelPath: string):Promise<string> {
    if (!this.whisper) throw new Error("Whisper module not initialized");
    const internalPath = "whisper-model.bin";
    const folder = "/models";

    const res = await fetch(modelPath);
    if (!res.ok) throw new Error(`Failed to fetch model: ${res.status}`);
    const buffer = await res.arrayBuffer();
    const uint8 = new Uint8Array(buffer);

    


    // Make a directory and write file into MEMFS
    this.whisper.FS_createPath("/", "models", true, true);
    this.whisper.FS_createDataFile(folder, internalPath, uint8, true, true);
    return `${folder}/${internalPath}`;
}

/**
 * Initializes the Whisper module with the specified model and language.
 *
 * This method:
 * 1. Creates the Whisper instance asynchronously.
 * 2. Loads the model file into the in-memory filesystem.
 * 3. Initializes Whisper with the model path and language code.
 *
 * @param {string} modelPath - Path or URL to the Whisper model file.
 * @param {string} lang - Language code (e.g., 'en') to configure the model.
 * @returns {Promise<void>} - Resolves when the Whisper module is fully initialized.
 */
  async init(modelPath: string, lang: string) {

    this.whisper = await createWhisperModule();
    //load path into virtual filesystem
    const path = await this.loadModelToFS(modelPath);
    this.whisper.init(path,lang);
  }

/**
 * Takes an input Float32Array and downsamples the data to the given output rate provided 
 * 
 * @param input Audio sample to be downsampled
 * @param inputRate The sample rate that the audio was recorded in
 * @param outputRate The sample rate the audio is being downsampled to
 * @returns {Float32Array} The down sampled data in a Float32Array object
 */
  private downSample(input: Float32Array, inputRate: number, outputRate: number):Float32Array{
    if (inputRate === outputRate) {
      return input;
    }

    const ratio = inputRate / outputRate;//3
    const newLength = Math.floor(input.length / ratio);//3
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


/**
 * Combines multiple smaller Float32Array chunks into a single fixed-size block.
 * If the combined length is less than oneBlockSamples, it fills up using chunks
 * sequentially from the buffer until the block is full or the buffer is empty.
 * 
 * 
 * @param {Float32Array[]} buffer Array of audio data chunks waiting to be combined
 * @param {number} blockSize Total length of Array that will be returned
 * @returns {Float32Array} Returns a single Array of size block size
 */
private combineChunks(buffer: Float32Array[], blockSize: number): Float32Array{

  const combined = new Float32Array(blockSize);
  let offset = 0;

  while (offset < blockSize && buffer.length > 0) {
    const currentChunk = buffer[0];
    const needed = blockSize - offset;

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


/**
 * 
 * Starts listening to the user's microphone input, collects audio chunks,
 * and feeds them into the Whisper model for transcription in real time.
 * 
 * The method continuously gathers small chunks from `AudioInputHandler`,
 * combines them into fixed-size blocks, downsamples them to 16kHz (required by Whisper),
 * and sends them to the model for inference.
 * 
 * @throws {Error} Throws if `init()` was not called before invoking this method.
 * 
 */
  public startListening(): void{
    if(!this.whisper) throw new Error("Call init() first");

      const inputSampleRate = this.audioHandler?.getSampleRate() || 48000;//default from browser is 48000
      const targetSampleRate = 16000;//whisper needs it to be this for best results
      const bufferSeconds = 2;//may need to adjust if too short of a time frame 
      const largeBlock = inputSampleRate * bufferSeconds;//creates the block size for x amount of seconds

      let buffer: Float32Array[] = [];
      let bufferLength = 0;

      
  

      this.audioHandler = new AudioInputHandler((chunk: Float32Array) => {
        
        //collects chunks until enough data is recieved
        buffer.push(chunk);
        bufferLength += chunk.length;

      
      while (bufferLength >= largeBlock) {//only send to whisper when enough chunks exist
        
        const combined = this.combineChunks(buffer, largeBlock);
        bufferLength -= largeBlock;

        //this may need to change to an third party api call later as it could be too cpu intensive
        //must be downsampled otherwise whisper wont work right
        const downsampled = this.downSample(combined, inputSampleRate, targetSampleRate);
    
        
        this.setAudio(1, downsampled);

        
    }
    });

    this.audioHandler.startListening();

  // Poll transcription every 200ms and processText
  this.transcriptionInterval = setInterval(() => {
    const text = this.getTranscribed();
    if(text && text.trim()){
      this.processText(text);
    }
  }, 200);
  }

  /**
 * Stops the audio input stream and halts the real-time transcription process.
 * 
 * This should be called after `startListening()` to stop capturing microphone input
 * and free up system audio resources.
 * 
 * @throws {Error} Throws if the Whisper module has not been initialized.
 */
  public stopListening(): void{
        if (!this.whisper) {
      throw new Error("Whisper module not initialized. Call init() first.");
    }
    this.audioHandler?.stopListening();
  }


/**
 * Sets the audio data at a given index for the Whisper model.
 * 
 * This method passes a Float32Array of audio samples
 * directly to the Whisper backend for processing.
 * 
 * @private
 * @param {number} index - The index position of the audio buffer to set (usually 0 or 1 for channels).
 * @param {Float32Array} audio - The raw audio data to be sent to the Whisper model.
 * @returns {number} - The status code or result returned by the Whisper backend.
 * @throws {Error} Throws if the Whisper module has not been initialized.
 */
  private setAudio(index: number, audio: Float32Array): number {
    if (!this.whisper) {
      throw new Error("Whisper module not initialized. Call init() first.");
    }
    return this.whisper.set_audio(index, audio);
  }


/**
 * Retrieves the latest transcription result from the Whisper model and logs it.
 * 
 * This method calls the underlying Whisper API to obtain the most recently
 * transcribed text. If any text has been returned from whisper, it logs it.
 * 
 * @returns {string} - The transcribed text from the current audio chunk.
 * @throws {Error} Throws if the Whisper module has not been initialized.
 */
  public getTranscribed():string{
    if (!this.whisper) {
      throw new Error("Whisper module not initialized. Call init() first.");
    }
    //adds text to logger
    const text = this.whisper.get_transcribed();
    if (text && text.trim()) {
      this.logText(text);
    }
    return text;
    
  }

/**
 * Takes in text and calls CommandConverter for processing and
 * command matching.
 * 
 * @param text transcribed words that have been recognized by whisper
 */
  private processText(text: string):void{

    if(text && text.trim() && !text.includes("[BLANK_AUDIO]")){
      this.commandConverter?.processTranscription(text);
    }
  }

  /**
   * Takes any recognized words from whisper and logs them into an array that contains a timestamp
   * Excludes the string returned from whisper [BLANK_AUDIO]
   * 
   * @param text transcribed words that have been recognized by whisper
   */
  private logText(text: string):void{
    if(text.includes("[BLANK_AUDIO]")){ 
      return;
    }
      const entry: transcribedLogEntry ={
        timestamp: new Date(),
        transcribedText: text,
      };
      //adds text to log if there is any
      if(!this.textLog) {this.textLog =[];}
      this.textLog.push(entry);
    }

    //only exists for demo purposes
    public getLoggedText():string{
      const lastEntry = this.textLog?.[this.textLog.length - 1];
      return `${lastEntry?.timestamp.toLocaleTimeString()}: ${lastEntry?.transcribedText}`;
    }
  
/**
 * Retrieves the current status of the Whisper model.
 * 
 * Returns `"loading"` if the model has not been initialized yet,
 * otherwise returns the status string provided by the Whisper backend.
 * 
 * @returns {string} - The current operational status of the Whisper module.
 */
  public getStatus(): string {
    if (!this.whisper) {
      return "loading";
    }
    return this.whisper.get_status();
  }

}