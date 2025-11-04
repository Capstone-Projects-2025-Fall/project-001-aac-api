
import { showHistoryPopup } from "./showHistoryPopup";
import { SpeechConverter } from "./SpeechConverterOffline";
import { CommandMapping } from "./commandMapping";

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
    private mapping: CommandMapping | null = null;

    constructor(){
        this.converter = new SpeechConverter();  
        this.mapping = new CommandMapping();
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
     * Allows the user to start speaking into the microphone and initiate game commands
     * 
     */
    public start():void {
        if(!this.converter) {
            throw new Error("Must call initiate() first");
        }
        this.converter?.startListening();
    }

    /**
     * Stops all voice recording and transcription
     * 
     */
    public stop():void {
        this.converter?.stopListening();
    }

    /**
     * Retrieves the full transcription history from the Whisper module.
     *
     * @returns {string[]} An array of transcription log entries,
     * each containing the transcribed text and its corresponding timestamp.
     */
    public getTranscribedFull():string[]{
        return this.converter?.getLoggedText() || [];
        
    }

    /**
     * Displays all game Commands in a toggleable modal
     * 
     */
    public displayCommandHistory():void{
        showHistoryPopup(); 
    }
    /**
     * Adds a voice command to the system.
     *
     * @param {GameCommand} command - The command object containing:
     *  - `name`: The name of the command that the user needs to speak.
     *  - `action`: A callback function that executes when the command is triggered.
     *  - `description`: A short explanation of what the command does. 
     *  - `active`: Whether the command is currently active. (true or false)
     * @returns true if successfully added
     */
    public addVoiceCommand(
    name: string,
    action: () => void,
    options?: {
      description?: string;
      active?: boolean;
      
    }
    ): boolean {
        return this.mapping?.addCommand(name,action, options) || false;
    }

    /**
     * Allows user to remove a command from the system
     * 
     * @param name The name of the command that is to be removed from the list
     * @returns true if successfully removed
     */
    public removeVoiceCommand(name: string): boolean {
        return this.mapping?.removeCommand(name) || false;
    }
    /**
     * Allows user to check if a game command has already been added
     * 
     * @param name The name of the command that is being checked
     * @returns true if found 
     */
    public isRegistered(name: string): boolean {
        return this.mapping?.hasCommand(name) || false;
    }
    /**
     * Allows user to see a list of all known game commands
     * 
     * @returns a list of all known game commands
     */
    public getCommands():string[] | []{
        return this.mapping?.getAllCommands() || [];
    }

    /**
     * Allows user to remove all game commands from system
     */
    public clearCommands(): void {
        this.mapping?.clearAllCommands();
    }


    




}