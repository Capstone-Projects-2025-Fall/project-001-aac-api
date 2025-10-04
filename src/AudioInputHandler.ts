

/**
 * 
 * AudioInputHandler is a microphone input handler that:
 * Captures audio from the user’s microphone.
 * Processes audio in chunks (Float32Array).
 * Sends those chunks to a callback function for further processing.
 * It also provides start/stop control and exposes the audio sample rate.
 */

export class AudioInputHandler {

  /** Media stream from users microphone */
  private stream: MediaStream | null = null;
  /** Used for processing the audio */
  private ctx: AudioContext | null = null;
  /** Used to buffer audio data*/
  private processor: ScriptProcessorNode | null = null;
  /** Flag that checks if startListening has already been called */
  public isListening: boolean = false;
  /** Callback function that receives each audio chunk captured from the microphone. */
  private onAudioChunk: (chunk: Float32Array) => void;


  /**
 * Creates a new AudioInputHandler.
 *
 * @param onAudioChunk - A callback function that is called whenever
 *                        an audio chunk is captured. Receives a Float32Array
 *                        containing the audio samples.
 */
  constructor(onAudioChunk: (chunk: Float32Array) => void) {
    this.onAudioChunk = onAudioChunk;
  }


  /**
 * Returns the sample rate of the audio context.
 *
 * @returns The sample rate in Hz, or `undefined` if the audio context is not initialized.
 */
  public getSampleRate() {
    return this.ctx?.sampleRate ?? 0;
  }

  /**
 * Starts capturing audio from the user's microphone.
 *
 * - Prompts the user for microphone permissions.
 * - Creates an AudioContext and a ScriptProcessorNode to process audio in chunks.
 * - Calls the `onAudioChunk` callback with a Float32Array for each audio buffer.
 * - Handles errors such as permission denial or missing microphone hardware.
 *
 * @returns A Promise that resolves when listening has started.
 */
  public async startListening(): Promise<void> {
    //bail if mic already running
    if (this.isListening) {
      console.log('already listening...');
    }
    

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error("This device does not support microphone input.")
        return;
        }

    try {
      // this line asks for user perms and starts rec
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.ctx = new AudioContext();
      const source = this.ctx.createMediaStreamSource(this.stream);
      this.processor = this.ctx.createScriptProcessor(8192, 1, 1);

      //connect audio graph nodes together
      source.connect(this.processor);
      this.processor.connect(this.ctx.destination); // connecting to speaker even though we are not outputting audio because apparently it might crash if not?

      //onaudioprocess that auto exexcutes when buffer full, e is the event data itself
      this.processor.onaudioprocess = (e) => {
        const input = e.inputBuffer.getChannelData(0); // this returns a Float32Array

        this.onAudioChunk(new Float32Array(input));
      };

            this.isListening = true;
            console.log("Microphone is listening...")
        } catch (err: any) {
            //updating so we dont have generic message and we know why the catch is hitting
            if (err.name === "NotAllowedError"){
                console.error("You may have denied microphone permissions... please try again");
            } else if (err.name === "NotFoundError") {
                console.error("No microphone was found on this device");
            } else {
                console.error("Error accessing Mic: " + err);
            }

        }
    }


    /**
 * Stops capturing audio from the microphone and cleans up resources.
 *
 * - Disconnects the ScriptProcessorNode from the audio graph.
 * - Closes the AudioContext.
 * - Stops all tracks of the MediaStream.
 * - Updates the `isListening` flag to `false`.
 */
  public stopListening(): void {
    // if never started, bail immediately
    if (!this.isListening) return;

    this.processor?.disconnect();
    this.ctx?.close();

    this.stream?.getTracks().forEach((track) => track.stop());
    this.isListening = false;

    console.log('Stopped listening...');
  }
}
