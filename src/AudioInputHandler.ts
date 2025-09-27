export class AudioInputHandler {
    private stream: MediaStream | null = null;
    private ctx: AudioContext | null = null;
    private processor: ScriptProcessorNode | null = null;
    public isListening: boolean = false;

    private onAudioChunk: (chunk: Float32Array) => void;

    constructor(onAudioChunk: (chunk: Float32Array) => void) {
        this.onAudioChunk = onAudioChunk;
    }

    public async startListening(): Promise<void> {
        //bail if mic already running
        if (this.isListening) {
            console.log("already listening...");
            return;
        }

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.error("This device does not support microphone input.")
            return;
        }

        try {
            // this line asks for user perms and starts rec
            this.stream = await navigator.mediaDevices.getUserMedia({audio: true})
            this.ctx = new AudioContext();
            const source = this.ctx.createMediaStreamSource(this.stream);
            this.processor = this.ctx.createScriptProcessor(4096, 1, 1);

            //connect audio graph nodes together
            source.connect(this.processor);
            this.processor.connect(this.ctx.destination) // connecting to speaker even though we are not outputting audio because apparently it might crash if not?

            //onaudioprocess that auto exexcutes when buffer full, e is the event data itself
            this.processor.onaudioprocess = (e) => {
                const input = e.inputBuffer.getChannelData(0); // this returns a Float32Array
                this.onAudioChunk(new Float32Array(input));
            }

            this.isListening = true;
            console.log("Microphone is listening...")
        } catch (err: any) {
            //updating so we dont have generic message and we know why the catch is hitting
            if (err.name === "NotAllowedError"){
                console.error("You may have denied microphone permissions... please try again");
            } else if (err.name === "NotFoundError") {
                console.error("No microphone was found on this device")
            } else {
                console.error("Error accessing Mic: " + err)
            }

        }
    }

    public stopListening(): void {
        // if never started, bail immediately
        if (!this.isListening) return;

        this.processor?.disconnect();
        this.ctx?.close();

        this.stream?.getTracks().forEach((track) => track.stop());
        this.isListening = false;

        console.log("Stopped listening...")
    }
}
