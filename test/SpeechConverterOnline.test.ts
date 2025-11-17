import {beforeEach, describe, it, expect, vi } from 'vitest';
import { AudioInputHandlerMock } from '../src/__mocks__/AudioInputHandler';



vi.mock('../src/whisper/libstream');
vi.mock("../src/CommandHistory");
vi.mock("../src/AudioInputHandler", () => ({
    AudioInputHandler: AudioInputHandlerMock
}));
vi.mock("../src/CommandConverter");

//@ts-expect-error used because its a test with a mockup
import { mockCommandConverter } from '../src/CommandConverter';
import {SpeechConverterOnline} from "../src/SpeechConverterOnline";


describe("SpeechConverterOnline", () =>{

    let converter: SpeechConverterOnline;


    beforeEach(async () => {
        vi.clearAllMocks();
        
        // Mock fetch globally for loading model files
        globalThis.fetch = vi.fn(async () => ({
            ok: true,
            arrayBuffer: async () => new ArrayBuffer(8),
        })) as unknown as typeof fetch;
        converter = new SpeechConverterOnline("http://localhost:8000");
        
    });
    it("throws error when trying to call init()", async () =>{

        expect(() => converter.init("fakeURL", "en")).toThrow("init() is not applicable for this Online transcription.");

    });
    it("throws error when getStatus() is called", () => {
        expect(() => converter.getStatus()).toThrow("Method not implemented.");
    });
    it("StopListening() stops the audio input handler", async () => {

        //initialize whisper
        ////await converter.init("/fake/path/model.bin", "en");

        converter.startListening();
        expect(AudioInputHandlerMock).toHaveBeenCalled();

        //makes sure the instance started listening and not just that the constructor ran
        const instance = AudioInputHandlerMock.mock.results[0].value;

        converter.stopListening();
        expect(instance.stopListening).toHaveBeenCalled();

    });
        it("Processes valid transcribed text", () => {
        const text = "run";
        (converter as any).processText(text);

        expect(mockCommandConverter.processTranscription).toHaveBeenCalledWith(text);
    });
    it("ProcessText called with null value", () => {

        const text = null;
        (converter as any).processText(text);
        expect(mockCommandConverter.processTranscription).not.toHaveBeenCalledWith(text);
    });
    it("ProcessText called with [BLANK_AUDIO]", () => {

        const text = "[BLANK_AUIDIO]";
        (converter as any).processText(text);
        expect(mockCommandConverter.processTranscription).toHaveBeenCalledWith(text);
    });
    it("ProcessText called with spaces only", () => {

        const text = " ";
        (converter as any).processText(text);
        expect(mockCommandConverter.processTranscription).not.toHaveBeenCalledWith(text);
    });
        it("Logs transcribed text", () => {
        const text = "logged text";
        (converter as any).logText(text);
        const logs = (converter as any).getTextLog();
        expect(logs[logs.length-1]).toContain(text);

    });
    it("Does not log blank audio", () =>{
        const text = "[BLANK_AUDIO]";
        (converter as any).logText(text);
        expect((converter as any).getTextLog()).toEqual([]);
    });
    it("combines chunks of data and returns a single Float32Array", () =>{

        let buffer = [
            new Float32Array([1,2,3,4,5]),
            new Float32Array([6,7,8,9,10]),

        ];
        let blockSize = buffer[0].length+buffer[1].length;
        const combined = (converter as any).combineChunks(buffer, blockSize);

        expect(combined).toEqual(new Float32Array([1,2,3,4,5,6,7,8,9,10]));

    });
    it('returns true for silence (RMS below 0.01)', () => {
    const waveform = new Float32Array([0.001, -0.002, 0.0005]);

    const result = (converter as any).isSilence(waveform);

    expect(result).toBe(true);
  });

  it('returns false for non-silence (RMS >= 0.01)', () => {
    const waveform = new Float32Array([0.1, -0.05, 0.08]);

    const result = (converter as any).isSilence(waveform);

    expect(result).toBe(false);
  });

  it('returns true for an all-zero waveform', () => {
    const waveform = new Float32Array([0, 0, 0, 0]);

    const result = (converter as any).isSilence(waveform);

    expect(result).toBe(true);
  });

  it('returns false at the threshold (RMS exactly 0.01)', () => {
    // needs to be these numbers because of rounding 
    const waveform = new Float32Array([0.0100001, -0.0100001]);

    const result = (converter as any).isSilence(waveform);

    expect(result).toBe(false);
  });


})


