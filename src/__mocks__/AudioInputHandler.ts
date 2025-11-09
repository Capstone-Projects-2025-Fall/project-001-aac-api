import { vi } from "vitest";

export const AudioInputHandlerMock = vi.fn().mockImplementation((onAudioChunk) =>({
    getSampleRate: vi.fn().mockReturnValue(48000),
    
    startListening: vi.fn().mockImplementation(() => {

        const buffer = new Float32Array(48000*2);
        for(let i =0; i< buffer.length; i++){
            buffer[i] = 0.5;
        }
        onAudioChunk(buffer);//returns a float32 array of vlaues 0.5
    }),
    stopListening: vi.fn(),
    isListening: false,

}));