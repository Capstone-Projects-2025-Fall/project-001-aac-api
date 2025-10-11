
import { showHistoryPopup } from "./showHistoryPopup";
import { SpeechConverter } from "./SpeechConverter";

/**
 * AACVoiceAPI is a facade class that provides a simplified interface
 * to multiple underlying classes and modules related to voice processing.
 *
 * This class wraps functionalities such as audio input handling, 
 * speech-to-text conversion, and command history management, 
 * exposing them through a single, easy-to-use API.
 * 
 * @class
 */

export class AACVoiceAPI{

    private converter: SpeechConverter | null = null;


    constructor(){
        this.converter = new SpeechConverter();    
    }

    /**
     * 
     * Initializes the API with the specified model and language
     * 
     * @param url Path to URL for the Whipser model file
     * @param language Language code to configure the model (e.g. 'en')
     */
    public initiate(url:string, language:string):void{

        this.converter?.init(url,language);

    }
    /**
     * This will allow the user to start speaking into the microphone and initiate game commands
     * 
     */
    public start():void {
        if(!this.converter) {
            throw new Error("Must call initiate() first");
        }
        this.converter?.startListening();
    }

    /**
     * This will stop recording of the microphone
     * 
     */
    public stop():void {
        this.converter?.stopListening();
    }

    /**
     * This will display all game Commands in a toggleable modal
     * 
     */
    public displayCommandHistory():void{
        showHistoryPopup(); 
    }

    




}