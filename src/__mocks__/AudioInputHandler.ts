import { vi } from "vitest";

export const AudioInputHandlerMock = vi.fn().mockImplementation((onAudioChunk) =>({
    getSampleRate: vi.fn().mockReturnValue(48000),
    
    startListening: vi.fn().mockImplementation(() => {

        const buffer = new Float32Array(48000*3).fill(0.5);

       return onAudioChunk(buffer);//returns a float32 array of values 0.5
    }),
    stopListening: vi.fn(),
    isListening: false,

}));