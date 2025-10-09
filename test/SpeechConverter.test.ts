import {beforeEach, describe, it, expect, vi } from 'vitest';
import { AudioInputHandlerMock } from '../src/__mocks__/AudioInputHandler';

vi.mock('../src/whisper/libstream');
vi.mock("../src/CommandHistory");
vi.mock("../src/AudioInputHandler", () => ({
    AudioInputHandler: AudioInputHandlerMock
}));



import createWhisperModule from '../src/whisper/libstream';
import {SpeechConverter} from "../src/SpeechConverter";


describe("SpeechConverter", () => {

    
    let converter: SpeechConverter;



    beforeEach(async () => {
        vi.clearAllMocks();
        
        // Mock fetch globally for loading model files
        globalThis.fetch = vi.fn(async () => ({
            ok: true,
            arrayBuffer: async () => new ArrayBuffer(8),
        })) as unknown as typeof fetch;

        converter = new SpeechConverter();
        
    });
    it("initializes Whisper module and loads model", async () => {  
        await converter.init("/fake/path/model.bin", "en");

        // // Check createWhisperModule called
        const mockedWhisper = vi.mocked(createWhisperModule);
        expect(mockedWhisper).toHaveBeenCalled();

        const whisperInstance = await mockedWhisper.mock.results[0].value;

        // Check FS_createPath and FS_createDataFile called
        expect(whisperInstance.FS_createPath).toHaveBeenCalledWith("/", "models", true, true);
        expect(whisperInstance.FS_createDataFile).toHaveBeenCalledWith(
        "/models",
        "whisper-model.bin",
        expect.any(Uint8Array),
        true,
        true
        );
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
    it("downsample() converts higher sample to a lower sample", () => {

        let highSample = 4;
        let outPutSample = 2;
        let buffer =  new Float32Array([1,2,3,4]);

        const result = (converter as any).downSample(buffer, highSample, outPutSample);

        expect(result).toEqual(new Float32Array([1.5, 3.5]));

    });
    it("downsample() returns original Array when input and output are the same", () => {
        let highSample = 2;
        let outPutSample = 2;
        let buffer =  new Float32Array([1,2,3,4]);

        const result = (converter as any).downSample(buffer, highSample, outPutSample);

        expect(result).toBe(buffer);
    });
    it("initialize and calls StartListening()", async () => {

        //initialize whisper
        await converter.init("/fake/path/model.bin", "en");
        const mockedWhisper = vi.mocked(createWhisperModule);
        expect(mockedWhisper).toHaveBeenCalled();

        //spy on private methods to make sure they get called
        const spyCombineChunks = vi.spyOn(converter as any, 'combineChunks');
        const spyDownSample = vi.spyOn(converter as any, 'downSample');
        const spySetAudio = vi.spyOn((converter as any), 'setAudio');

        const WhisperModuleInstance = await mockedWhisper.mock.results[0].value;

        converter.startListening();
        expect(AudioInputHandlerMock).toHaveBeenCalled();

        //makes sure the instance started listening and not just that the constructor ran
        const instance = AudioInputHandlerMock.mock.results[0].value;
        expect(instance.startListening).toHaveBeenCalled();

        //makes sure core methods were called within start listening
        expect(spySetAudio).toHaveBeenCalled()
        expect(WhisperModuleInstance.set_audio).toHaveBeenCalled();
        expect(spyCombineChunks).toHaveBeenCalled();
        expect(spyDownSample).toHaveBeenCalled();


    });
    it("gets transcribed Text", async () => {
        
        //initialize whisper
        await converter.init("/fake/path/model.bin", "en");
        expect(createWhisperModule).toHaveBeenCalled();
        


    });
    it("throws error on getTranscribedText() is called without initializing", () => {
        expect(() => converter.getTranscribed()).toThrow("Call init() first");

    });
    it("throws error when startListening() is called without initializing", () =>{
        expect(() => converter.startListening()).toThrow("Call init() first");
    });
    it("throws error when stopListening() is called without initializing", () =>{
        expect(() => converter.stopListening()).toThrow("Call init() first");
    });
    it("stopListening() stops the audio input handler", async () => {

        //initialize whisper
        await converter.init("/fake/path/model.bin", "en");

        converter.startListening();
        expect(AudioInputHandlerMock).toHaveBeenCalled();

        //makes sure the instance started listening and not just that the constructor ran
        const instance = AudioInputHandlerMock.mock.results[0].value;

        converter.stopListening();
        expect(instance.stopListening).toHaveBeenCalled();

    });
    it("calls setAudio successfully", async () => {

        const index = 1;
        const data = new Float32Array([0.1,0.2,0.3]);

        //initialize whisper
        await converter.init("/fake/path/model.bin", "en");
        const mockedWhisper = vi.mocked(createWhisperModule);
        const WhisperModuleInstance = await mockedWhisper.mock.results[0].value;
        

        const result = (converter as any).setAudio(index, data);
        expect(result).toEqual(1);
        expect(WhisperModuleInstance.set_audio).toHaveBeenCalled();

    });
    it("calls setAudio without initializing", () => {
        expect(() => (converter as any).setAudio(1, new Float32Array())).toThrow("Whisper module not initialized. Call init() first.");

    });



    


})
