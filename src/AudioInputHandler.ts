export class AudioInputHandler {
    private stream: MediaStream | null = null;
    private onStreamReady: (stream: MediaStream) => void;
    public isListening: boolean = false;

    constructor(onStreamReady: (stream: MediaStream) => void) {
        this.onStreamReady = onStreamReady;

        // add a way to handle immediately if users device does
        // not have a microphone
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
            console.error("Device does no have microphone permissions...")
        }
    }

    public async startListening(): Promise<void> {
        //return early if already listening and called
        if (this.isListening) {
            console.log("already listening...");
            return;
        }

        try {
            // call the line that will prompt user for mic access
            // set equal to object variable so we use the stream outside this function as well
            // eg stopListening
            const audioStream = await navigator.mediaDevices.getUserMedia({audio: true})
            this.stream = audioStream;
            this.isListening = true;
            this.onStreamReady(this.stream);

            console.log("Microphone is listening...")
        } catch (err) {
            console.error("You may have blocked microphone permissions... please try again");
        }
    }

    public stopListening(): void {
        // release the stream, set stream to null, set isListening to false
        if (!this.stream) return;

        this.stream.getTracks().forEach((track) => track.stop());
        this.isListening = false;
        this.stream = null;
        console.log("Stopped listening...")
    }
}

//navigator is a global object in web browsers that provides info about the browser itself and the environment
// its running in. it acts an entry poitn to varius web APIs. Allowing your code to access device hardware like
// the microphone or check the usrs location