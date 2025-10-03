import {SpeechConverter} from '../src//SpeechConverter';
import { describe,  expect } from 'vitest'


describe("init Whisper", async() =>{
 const whisper = await new SpeechConverter();



   expect(whisper.init('fail', "en")).toBe("Whisper Initialized");





})
