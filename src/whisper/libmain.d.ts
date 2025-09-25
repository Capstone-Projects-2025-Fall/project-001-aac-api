// src/whisper/libmain.d.ts

export interface WhisperModuleOptions {
  locateFile?: (file: string) => string;
}

export interface WhisperModule {
  // Emscripten-bound functions
  init(path_model: string): number;
  free(ctxIndex: number): void;
  full_default(
    ctxIndex: number,
    audio: Float32Array,
    lang: string,
    nthreads: number,
    translate: boolean
  ): number;
  get_segment_count(ctxIndex: number): number;
  get_segment_text(ctxIndex: number, segIndex: number): string;

  // Emscripten FS API
  FS_createDataFile(
    parent: string,
    name: string,
    data: Uint8Array,
    canRead: boolean,
    canWrite: boolean
  ): void;
}

// Declare the module factory function as default export
declare const createWhisperModule: (options?: WhisperModuleOptions) => Promise<WhisperModule>;
export default createWhisperModule;
