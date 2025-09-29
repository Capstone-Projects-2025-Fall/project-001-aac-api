// libstream.d.ts

export interface WhisperModule {
  /**
   * Initialize the module with a model path and language code.
   * @param urlToPath Path or URL to the model binary
   * @param langCode Language code (e.g., "en", "fr")
   * @returns number (usually success/error code)
   */
  init(urlToPath: string, langCode: string): number;

  /**
   * Free resources associated with a specific index.
   * @param index Resource index
   */
  free(index: number): void;

  /**
   * Set audio data for a specific index.
   * @param index Resource index
   * @param audio JavaScript array of audio samples (Float32Array, number[])
   * @returns number (success/error code)
   */
  set_audio(index: number, audio: Array<number> | Float32Array): number;

  /**
   * Get the latest transcribed string from the module.
   * @returns Transcribed text
   */
  get_transcribed(): string;

  /**
   * Get the current module status.
   * @returns Status string ("loading" | "ready" | "error")
   */
  get_status(): string;

  /**
   * Update the module status.
   * @param status Status string ("loading" | "ready" | "error")
   */
  set_status(status: string): void;

  FS_createDataFile(
    parent: string,
    name: string,
    data: Uint8Array | ArrayBuffer,
    canRead: boolean,
    canWrite: boolean,
    canOwn?: boolean,
  ): void;

  FS_preloadFile(localPath: string, url: string, onload?: () => void, onerror?: () => void): void;

  FS_unlink(path: string): void;
  FS_createPath(parent: string, path: string, canRead?: boolean, canWrite?: boolean): string;

  // Runtime dependency management
  addRunDependency(id: string): void;
  removeRunDependency(id: string): void;

  // Memory access (useful for debugging)
  HEAPU8: Uint8Array;

  // Call C functions directly (advanced usage)
  //ccall(funcName: string, returnType: string, argTypes: string[], args: any[]): any;
  //cwrap(funcName: string, returnType: string, argTypes: string[]): Function;

  // Emscripten runtime
  calledRun: boolean;
  print: (text: string) => void;
  printErr: (text: string) => void;
}

/**
 * Factory function to create the module.
 * Returns a Promise that resolves to the fully initialized WhisperModule.
 */
declare function createWhisperModule(): Promise<WhisperModule>;
export default createWhisperModule;
