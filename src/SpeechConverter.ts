import createWhisperModule, { WhisperModule } from "./whisper/libmain.js";

export class SpeechConverter {
  private whisperModule: WhisperModule | null = null;
  private ctxIndex: number = 0;

  constructor() {}

  async init() {
    // 1️⃣ Load the WASM module
    this.whisperModule = await createWhisperModule({
      locateFile: (file) => `./dist/whisper/${file}`, // wasm loader
    });

    console.log("Whisper module loaded");
    console.log("Whisper module keys:", Object.keys(this.whisperModule));

    // 2️⃣ Fetch the model as ArrayBuffer
    const response = await fetch("./dist/whisper/models/ggml-tiny.en.bin");
    const buffer = await response.arrayBuffer();

    try {
  this.whisperModule.FS_createPath("/", "models", true, true);
} catch (e) {
  // ignore if it already exists
}
  async function loadWavAsFloat32(url: string): Promise<Float32Array> {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioCtx = new AudioContext();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    return audioBuffer.getChannelData(0); // mono channel
}

    // 3️⃣ Mount the model into the WASM virtual filesystem
    this.whisperModule.FS_createDataFile(
      "/models",
      "ggml-tiny.en.bin",
      new Uint8Array(buffer),
      true,
      true
    );

    // 4️⃣ Initialize Whisper context using the WASM C function
    // This replaces the non-existent this.whisperModule.init()
    this.ctxIndex = this.whisperModule.init(
      "/models/ggml-tiny.en.bin"
    );

    if (this.ctxIndex <= 0) throw new Error("Failed to init whisper model");
    console.log("Context created:", this.ctxIndex);
  }

  async convertAudio(float32Audio: Float32Array) {
    if (!this.whisperModule) throw new Error("Module not initialized");
    if (this.ctxIndex <= 0) throw new Error("Context not initialized");

    // Run transcription
    this.whisperModule.full_default(this.ctxIndex, float32Audio, "en", 4, false);

    // Collect segments
    const nSegments = this.whisperModule.get_segment_count(this.ctxIndex);
    let transcript = "";
    for (let i = 0; i < nSegments; i++) {
      transcript += this.whisperModule.get_segment_text(this.ctxIndex, i) + " ";
    }
    return transcript.trim();
  }

  free() {
    if (this.whisperModule && this.ctxIndex > 0) {
      this.whisperModule.free(this.ctxIndex);
      this.ctxIndex = 0;
    }
  }
}
