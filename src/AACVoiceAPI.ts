
import { showHistoryPopup } from "./showHistoryPopup";
import { SpeechConverter } from "./SpeechConverter";

export class AACVoiceAPI{

    private converter: SpeechConverter | null = null;


    constructor(){

        this.converter = new SpeechConverter();
        
    }

    public initiate(url:string, language:string):void{

        this.converter?.init(url,language);

    }
    public start():void {
        if(!this.converter) {
            throw new Error("Must call initiateWhisper first");
        }
        this.converter?.startListening();
    }
    public stop():void {
        this.converter?.stopListening();
    }
    public displayCommandHistory():void{
        showHistoryPopup(); 
    }

    




}