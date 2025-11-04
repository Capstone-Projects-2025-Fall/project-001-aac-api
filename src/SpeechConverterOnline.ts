import { SpeechConverterInterface, transcribedLogEntry, TranscriptionResponse } from "./SpeechConverterInterface";
import { AudioInputHandler } from "./AudioInputHandler";
import { CommandConverter } from "./CommandConverter";

export class SpeechConverterOnline implements SpeechConverterInterface{
    /** Used to capture microphone input */
    private audioHandler: AudioInputHandler | null = null;
  /** Processes transcribed text and matches commands */
  private commandConverter: CommandConverter | null = null;
  /**  Keeps a log of all text that has been transcribed*/
  private textLog: transcribedLogEntry[] | null = null;
  private transcriptionInterval?: ReturnType<typeof setInterval>;
  private url: string = "http://localhost:8000/transcription/";

      /**
       * updates the 
       * 
       * @param backendURL url of hosted backend
       */
      constructor(backendURL: string) {
        this.commandConverter = CommandConverter.getInstance();
        if(backendURL){
          this.url = backendURL;
        }
      }
    
    public init(modelPath: string, lang: string): Promise<void> {
        console.log("This implementation does not support this method. Please switch implementation to offline to use: ", modelPath, lang)
        throw new Error("init() is not applicaple for this Online transcription.");
    }
   public startListening(): void {
    
    const inputSampleRate = this.audioHandler?.getSampleRate() || 48000; //default from browser is 48000
    const bufferSeconds = 3; //may need to adjust if too short of a time frame
    const largeBlock = inputSampleRate * bufferSeconds; //creates the block size for x amount of seconds

    let buffer: Float32Array[] = [];
    let bufferLength = 0;

    this.audioHandler = new AudioInputHandler(async (chunk: Float32Array) => {
      //collects chunks until enough data is recieved
      buffer.push(chunk);
      bufferLength += chunk.length;
      
      while (bufferLength >= largeBlock) {
        //only send to speechbrain when enough chunks exist
        const combined = this.combineChunks(buffer, largeBlock);
        const audioBuffer = new Float32Array(combined).buffer;
        bufferLength -= largeBlock;
        try{
          const response = await fetch(this.url, {
            method: "POST",
            headers: {
                "Content-Type": "application/octet-stream",
                "X-Sample-Rate": inputSampleRate.toString()
                },
            body: audioBuffer
            });
            
            if(!response.ok){ 
              throw new Error(`Did not return status:200 ${response.status}`)
            }
            const transcribed: TranscriptionResponse = await response.json();
            console.log(transcribed);
          
            if(transcribed.success){
              if(transcribed.transcription && transcribed.transcription.trim())
                {
                this.processText(transcribed.transcription);
                this.logText(transcribed.transcription);
              }
            }
        }
        catch (err){
            console.log("Issue trancsribing voice on Backend: ", err);
            throw new Error("Issue transcribing voice on Backend.");
        }
        
        
      }
    });
        this.audioHandler.startListening();
  }

    public stopListening(): void {
        this.audioHandler?.stopListening();
    }
    public getTranscribed(): string {
    //adds text to logger
    const text = this.getTextLog();
    return text.toString();
    }
    getStatus(): string {
        throw new Error("Method not implemented.");
    }

  private combineChunks(buffer: Float32Array[], blockSize: number): Float32Array {
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
   * Takes in text and calls CommandConverter for processing and
   * command matching.
   *
   * @param text transcribed words that have been recognized by whisper
   */
  private processText(text: string): void {
    if (text && text.trim() && !text.includes('[BLANK_AUDIO]')) {
      this.commandConverter?.processTranscription(text);
    }
  }
    /**
   * Takes any recognized words from whisper and logs them into an array that contains a timestamp
   * Excludes the string returned from whisper [BLANK_AUDIO]
   *
   * @param text transcribed words that have been recognized by whisper
   */
  private logText(text: string): void {
    if (text.includes('[BLANK_AUDIO]')) {
      return;
    }
    const entry: transcribedLogEntry = {
      timestamp: new Date(),
      transcribedText: text,
    };
    //adds text to log if there is any
    if (!this.textLog) {
      this.textLog = [];
    }
    this.textLog.push(entry);
  }

  /**
   * 
   * @returns {string[]} Returns an array of transcribed
   */
  public getTextLog(): string[] {
    const logOfText = [];
    if (!this.textLog) return [];
    for (let i = 0; i < this.textLog.length; i++) {
      const date = this.textLog[i].timestamp.toLocaleTimeString();
      const text = this.textLog[i].transcribedText;
      logOfText.push(`${date} : ${text}\n`);
    }
    return logOfText;
  }


}