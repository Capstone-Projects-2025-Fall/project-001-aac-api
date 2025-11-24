
import { showHistoryPopup } from "./showHistoryPopup";
import { SpeechConverterInterface } from "./SpeechConverterInterface";
import { SpeechConverterOffline } from "./SpeechConverterOffline";
import { SpeechConverterOnline } from "./SpeechConverterOnline";
import { CommandMapping } from "./commandMapping";
import { ConfidenceConfig } from './ConfidenceConfig';
import { CommandConverter} from './CommandConverter';

/**
 * AACVoiceAPI is a facade class that provides a simplified interface
 * to multiple underlying classes and modules related to voice processing.
 *
 * This class wraps functionalities such as audio input handling, 
 * speech-to-text conversion, and command history management, 
 * exposing them through a single, easy-to-use API.
 *
 * @example
 * // Offline
 * const api = new AACVoiceAPI();
 * await api.initiate({
 *  mode: 'offline',
 *  modelUrl: 'models/whisper-tiny.bin',
 *  language: 'en'
 *  });
 *
 * * @example
 * // Online
 * const api = new AACVoiceAPI();
 * await api.initiate({
 *  mode: 'online',
 *  backendUrl: 'http://localhost:8000'
 *  });
 *
 * @class
 */

export interface voiceAPIConfig {
    mode: 'offline' | 'online';
    modelUrl: string,
    language?: string;
    useSpeakerSeparation?: boolean;
    confidenceThreshold?: number;
    usePhoneticMatching?: boolean;
    logConfidenceScores?: boolean;
    }

export class AACVoiceAPI{
    private converter: SpeechConverterInterface | null = null;
    private mapping: CommandMapping | null = null;
    private currentMode: 'offline' | 'online' | null = null;
    private isCurrentlyListening: boolean = false;
    private domain: string = "http://localhost:8000";
    constructor(){
        this.mapping = new CommandMapping();
    }

    /**
     * 
     * Initializes the API with the specified model and language
     * 
     * @param url Path to URL for the Whisper model file
     * @param language Language code to configure the model (e.g. 'en') for offline mode 
     * @throws {Error} Throws error when modelUrl is not provided in the params in .initiate() for online mode  
     */
    public async initiate(config: voiceAPIConfig): Promise<void> {
        this.currentMode = config.mode;

        if (config.confidenceThreshold !== undefined ||
          config.usePhoneticMatching !== undefined ||
          config.logConfidenceScores !== undefined) {

          const confidenceConfig: Partial<ConfidenceConfig> = {};

          if (config.confidenceThreshold !== undefined) {
            confidenceConfig.globalThreshold = config.confidenceThreshold;
          }
          if (config.usePhoneticMatching !== undefined) {
            confidenceConfig.usePhoneticMatching = config.usePhoneticMatching;
          }
          if (config.logConfidenceScores !== undefined) {
            confidenceConfig.logConfidenceScore = config.logConfidenceScores;
          }

          const converter = CommandConverter.getInstance();
          converter.getConfidenceMatcher().updateConfig(confidenceConfig);
      }

        if (config.mode === 'offline') {
            if (!config.modelUrl || !config.language) {
                throw new Error("Offline mode requires modelUrl and langauge parameters");
            }

            this.converter = new SpeechConverterOffline();
            await this.converter.init(config.modelUrl, config.language);

        } else if (config.mode === 'online') {
            this.domain = config.modelUrl;
            const useSeparation = config.useSpeakerSeparation ?? false;
            this.converter = new SpeechConverterOnline(this.domain, useSeparation);

            const modeText = useSeparation ? 'with speaker separation' : 'single speaker';
            console.log(`Initialized in online mode (${modeText})`);

        } else {
            throw new Error(`Invalid mode: ${config.mode}. Use 'offline' or 'online'`);
      }
    }

    /**
     * Initialize online mode for single speaker
     */
    public async initiateOnlineSingleSpeaker(domainName: string): Promise<void> {
        this.domain = domainName;
        await this.initiate({
            mode: 'online',
            modelUrl: this.domain,
            useSpeakerSeparation: false
        });
    }

    /**
     * Initialize online mode with speaker separation
     */
    public async initiateOnlineMultiSpeaker(domainName: string): Promise<void> {
        this.domain = domainName
        await this.initiate({
            mode: 'online',
            modelUrl: this.domain,
            useSpeakerSeparation: true
        });
    }

    /**
     * Switches between single speaker and multi-speaker mode for online mode
     * Automatically restarts listening if currently active
     *
     * @param useSpeakerSeparation Whether to use speaker separation
     * @throws {Error} If not in online mode or not initialized
     *
     * @example
     * // Switch to multi speaker
     * api.switchSpeakerMode(true);
     *
     * // Switch back to single speaker
     * api.switchSpeakerMode(false);
     */
    public switchSpeakerMode(useSpeakerSeparation: boolean): void {
        if (!this.converter) {
            throw new Error("Must call initiate() first before switching modes");
        }

        if (this.currentMode !== 'online') {
            throw new Error("Can only switch speaker mode in online mode. Current mode: " + this.currentMode);
        }

        if (!(this.converter instanceof SpeechConverterOnline)) {
            throw new Error("Converter is not SpeechConverterOnline");
        }

        const wasListening = this.isCurrentlyListening;

        if (wasListening) {
            this.converter.stopListening();
            this.isCurrentlyListening = false;
        }

        this.converter = new SpeechConverterOnline(this.domain, useSpeakerSeparation);

        const modeText = useSpeakerSeparation ? 'multi-speaker' : 'single-speaker';
        console.log(`Switched to ${modeText} mode`);

        if (wasListening) {
            this.converter.startListening();
            this.isCurrentlyListening = true;
        }
    }

    public toggleSpeakerMode(): void {
         if (this.currentMode !== 'online') {
            throw new Error("Can only toggle speaker mode in online mode");
        }

        if (!(this.converter instanceof SpeechConverterOnline)) {
            throw new Error("Converter is not online mode");
        }

        const currentSeparation = this.converter.getUseSeparation();
        this.switchSpeakerMode(!currentSeparation);
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
        this.isCurrentlyListening = true;
    }

    /**
     * Stops all voice recording and transcription
     *
     */
    public stop():void {
        this.converter?.stopListening();
        this.isCurrentlyListening = false;
    }

    /**
     * Retrieves the full transcription history from the Whisper module.
     *
     * @returns {string[]} An array of transcription log entries,
     * each containing the transcribed text and its corresponding timestamp.
     */
    public getTranscriptionLogs():string[]{
        return this.converter?.getTextLog() || [];
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
     * Optionally fetches and registers synonyms from DataMuse API.
     *
     * @param {string} name: The name of the command that the user needs to speak.
     * @param {Function} action: A callback function that executes when the command is triggered.
     * @param {string} options.description: A short explanation of what the command does. 
     * @param {boolean} options.active: Whether the command is currently active. (true or false)
     * @param {boolean} options.fetchSynonyms: Whether to automatically fetch synonyms (default: true)
     * @returns Promise<boolean> true if successfully added
     */
    public async addVoiceCommand(
    name: string,
    action: () => void,
    options?: {
      description?: string;
      active?: boolean;
      fetchSynonyms?: boolean;
      
    }
    ): Promise<boolean> {
        if (!this.mapping) {
            return false;
        }

        return await this.mapping?.addCommand(name,action, options);
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

   /**
    * Gets the current mode of operation
    *
    * @returns The current mode ('offline' or 'online'), or null if not initialized
    */
    public getMode(): string {
        if (this.currentMode === null) {
            return "Call initiate and try again!"
        }
        return this.currentMode
    }

   /**
    * Tells the user if speaker separation toggle is on
    *
    * @returns The current status of whether speaker separation is on or off
    */
    public isUsingSpeakerSeparation(): boolean | null {
        if (this.currentMode !== 'online') {
            return null;
        }

        if (this.converter instanceof SpeechConverterOnline) {
            return this.converter.getUseSeparation();
        }

        return null;
    }
}