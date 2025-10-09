import { vi } from "vitest";

export const AudioInputHandlerMock = vi.fn().mockImplementation((onAudioChunk) =>({
    getSampleRate: vi.fn().mockReturnValue(48000),
    
    startListening: vi.fn().mockImplementation(() => {
        onAudioChunk(new Float32Array(48000*2));//large enough to enter while loop of real function
    }),
    stopListening: vi.fn(),
    isListening: false,

}));