import {AudioInputHandler} from "../src/AudioInputHandler";
import {beforeEach, describe, expect, it, Mock, vi} from "vitest";

describe('AudioInputHandler', () => {
    let mockGetUserMedia: Mock;
    let mockAudioContext: any;
    let mockOnAudioChunk: Mock;
    let mockMediaStream: any;
    let mockSource: any;
    let mockProcessor: any;

    beforeEach(() => {

        // --mock callback in constructor------
        mockOnAudioChunk = vi.fn();

        // --mock media stream------
        // in stopListening stream has 'getTracks' called on it,
        // and each element in array stop() can be called on it
        const mockTrack = {
            stop: vi.fn(),
        }

       mockMediaStream = {
            getTracks: vi.fn().mockReturnValue([mockTrack]),
        }

        // --mock processor node---------
        mockProcessor = {
            disconnect: vi.fn(),
            connect: vi.fn(),
            onaudioprocess: null,
        }

        mockSource = {
            connect: vi.fn(),

        }

        mockAudioContext = {
            createMediaStreamSource: vi.fn().mockReturnValue(mockSource),
            createScriptProcessor: vi.fn().mockReturnValue(mockProcessor),
            close: vi.fn(),
            sampleRate: 48000,
            destination: {},
        }

        Object.defineProperty(global, 'AudioContext', {
            value: vi.fn(() => mockAudioContext),
            writable: true,
            configurable: true,
        });

        mockGetUserMedia = vi.fn().mockResolvedValue(mockMediaStream);

        Object.defineProperty(global, 'navigator', {
            value: {
                mediaDevices: {
                    getUserMedia: mockGetUserMedia,
                },
            },
            writable: true,
            configurable: true,
        });

    });

    it('should create an instance with the callback ', () => {
        const handler = new AudioInputHandler(mockOnAudioChunk);

        expect(handler).toBeInstanceOf(AudioInputHandler);
        expect(handler.isListening).toBe(false);
    });

    it('should return a sample rate of 48000', async () => {
        const handler = new AudioInputHandler(mockOnAudioChunk);
        await handler.startListening();

        expect(handler.getSampleRate()).toBe(48000);
    });

    it('should say that we are listening with true', async () => {
        const handler = new AudioInputHandler(mockAudioContext);
        await handler.startListening();

        expect(handler.isListening).toBe(true);
    });

    it('should call onAudioChuk when audio data arrives', async () => {
        const handler = new AudioInputHandler(mockOnAudioChunk);

        await handler.startListening();

        //simming audio data arriving
        const fakeAudioData = new Float32Array([0.1,0.2,0.3,0.4]);
        const fakeEvent = {
            inputBuffer: {
                getChannelData: vi.fn().mockReturnValue(fakeAudioData),
            }
        }

        mockProcessor.onaudioprocess(fakeEvent);
        expect(mockOnAudioChunk).toHaveBeenCalledTimes(1);
    });

    it('should stop listening and clean up resources', async () => {
        const handler = new AudioInputHandler(mockOnAudioChunk);

        await handler.startListening();
        handler.stopListening();

        //clean up verify
        expect(mockProcessor.disconnect).toHaveBeenCalled();
        expect(mockAudioContext.close).toHaveBeenCalled();

        //see if tracks stopped
        const tracks = mockMediaStream.getTracks();
        expect(tracks[0].stop).toHaveBeenCalled();

        expect(handler.isListening).toBe(false);
    });


})