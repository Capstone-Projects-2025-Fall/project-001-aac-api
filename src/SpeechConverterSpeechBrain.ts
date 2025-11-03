
import { SpeechConverterInterface } from "./SpeechConverterInterface";


export class SpeechConverterSpeechBrain implements SpeechConverterInterface{
    init(modelPath: string, lang: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    startListening(): void {
        throw new Error("Method not implemented.");
    }
    stopListening(): void {
        throw new Error("Method not implemented.");
    }
    getTranscribed(): string {
        throw new Error("Method not implemented.");
    }
    getLoggedText(): string[] {
        throw new Error("Method not implemented.");
    }
    getStatus(): string {
        throw new Error("Method not implemented.");
    }




}