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
  private useSeparation: boolean = false;
  private url: string;

      /**
       * updates the url to point to the correct backend on initialization
       * 
       * @param backendURL url of hosted backend
       */
      constructor(useSeparation: boolean = false) {
        this.commandConverter = CommandConverter.getInstance();
        this.useSeparation = useSeparation;
        this.url = useSeparation
          ? 'http://localhost:8000/transcription/'
          : 'http://localhost:8000/transcription/separation/';
        console.log(`Using endpoint: ${this.url}`);
      }

    /**
     * Get whether speaker separation is enabled
     *
     * @returns true if using separation endpoint
     */
    public getUseSeparation(): boolean {
        return this.useSeparation;
    }

    /**
     * 
     * Is not implemented for this version, throws an error if called
     * 
     */
    public init(modelPath: string, lang: string): Promise<void> {
        console.log("This implementation does not support this method. Please switch implementation to offline to use: ", modelPath, lang)
        throw new Error("init() is not applicaple for this Online transcription.");
    }

    /**
   *
   * Starts listening to the user's microphone input, collects audio chunks,
   * and feeds them into the backend for transcription in real time.
   *
   * The method continuously gathers small chunks from `AudioInputHandler`,
   * combines them into fixed-size blocks and sends them to the model for inference.
   *
   * @throws {Error} Throws if fetch status is not 200
   * @throws {Error} Throws if Promise fails to resolve
   *
   */
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
  /**
   * Stops the audio input stream and halts the real-time transcription process.
   *
   * This should be called after `startListening()` to stop capturing microphone input
   * and free up system audio resources.
   *
   */
    public stopListening(): void {
        this.audioHandler?.stopListening();
    }
  /**
   * Retrieves the latest transcription result from the Whisper model and logs it.
   *
   * This method calls the underlying Whisper API to obtain the most recently
   * transcribed text. If any text has been returned from whisper, it logs it.
   *
   * @returns {string} - The transcribed text from the current audio chunk.
   * 
   */
    public getTranscribed(): string {
    //adds text to logger
    const text = this.getTextLog();
    return text.toString();
    }
    
    /**
     * Is not implemented for this implementation of SpeechConverter
     * @throws {Error} Method not implemented
     */
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
   * Takes any recognized words and logs them into an array that contains a timestamp
   * Excludes the string [BLANK_AUDIO]
   *
   * @param text transcribed words that have been recognized
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
   * takes the array of objects that hold the transcribed logs 
   * and converts it into a string of the following format
   * Timestamp: Transcribed text
   * 
   * @returns {string[]} Returns an array of transcribed logs
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