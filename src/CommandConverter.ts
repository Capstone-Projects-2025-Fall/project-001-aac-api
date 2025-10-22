import { CommandLibrary, GameCommand } from './commandLibrary';

/**
 * CommandConverter processes transcribed text in real-time, tokenizes it,
 * and matches words against the CommandLibrary.
 * 
 * This class:
 * - Tokenizes incoming transcription text into individual words
 * - Normalizes and cleans tokens (lowercase, trim, remove punctuation)
 * - Checks each token against the CommandLibrary
 * - Stores matched commands in a command log with timestamps
 * - Automatically executes matched commands
 * - Invokes callback when commands are matched
 */
export class CommandConverter {
  /** Reference to the CommandLibrary for looking up commands */
  private library: CommandLibrary;

  /** Log of matched commands with timestamps */
  private commandLog: CommandLogEntry[] = [];

  /** Whether logging is enabled */
  private enabled = true;

  /** Callback function invoked when commands are matched */
  private onCommandMatched?: (commands: GameCommand[], transcription: string) => void;

  /** The single global instance of CommandConverter */
  private static instance: CommandConverter;

  /** Private constructor prevents direct instantiation */
  private constructor() {
    this.library = CommandLibrary.getInstance();
  }

  /**
   * Returns the singleton instance of CommandConverter.
   * 
   * @returns {CommandConverter} The single shared instance.
   */
  public static getInstance(): CommandConverter {
    if (!CommandConverter.instance) {
      CommandConverter.instance = new CommandConverter();
    }
    return CommandConverter.instance;
  }

  /**
   * Normalizes a word by converting to lowercase, trimming whitespace,
   * and removing common punctuation marks.
   * 
   * @private
   * @param {string} word - The word to normalize
   * @returns {string} The normalized word
   */
  private normalize(word: string): string {
    return word
      .toLowerCase()
      .trim()
      .replace(/[.,!?;:'"]/g, ''); // Remove common punctuation
  }

  /**
   * Tokenizes a transcription string into individual words.
   * Splits on whitespace and filters out empty tokens.
   * 
   * @private
   * @param {string} transcription - The transcribed text to tokenize
   * @returns {string[]} Array of individual word tokens
   */
  private tokenize(transcription: string): string[] {
    return transcription
      .split(/\s+/) // Split on whitespace
      .map(token => this.normalize(token))
      .filter(token => token.length > 0); // Remove empty tokens
  }

  /**
   * Processes new transcription text by tokenizing it and checking
   * each token against the CommandLibrary.
   * 
   * For each matched command:
   * - Logs it to the command log with a timestamp
   * - Automatically executes the command's action
   * 
   * @param {string} transcription - The new transcribed text from getTranscribed()
   * @returns {GameCommand[]} Array of matched commands found in the transcription
   */
  public processTranscription(transcription: string): GameCommand[] {
    if (!this.enabled || !transcription || !transcription.trim()) {
      return [];
    }

    const tokens = this.tokenize(transcription);
    const matchedCommands: GameCommand[] = [];

    for (const token of tokens) {
      if (this.library.has(token)) {
        const command = this.library.get(token);
        
        if (command && command.active) {
          matchedCommands.push(command);
          
          // Log the matched command
          this.logCommand(command, transcription);
          
          // Always execute the command
          try {
            command.action();
          } catch (error) {
            console.error(`Error executing command "${command.name}":`, error);
          }
        }
      }
    }

    // Invoke callback if commands were matched 
    // still needs to be done
    if (matchedCommands.length > 0 && this.onCommandMatched) {
      try {
        this.onCommandMatched(matchedCommands, transcription);
      } catch (error) {
        console.error('Error in onCommandMatched callback:', error);
      }
    }

    return matchedCommands;
  }

  /**
   * Logs a matched command to the command log.
   * 
   * @private
   * @param {GameCommand} command - The matched command
   * @param {string} originalText - The original transcription text
   */
  private logCommand(command: GameCommand, originalText: string): void {
    const entry: CommandLogEntry = {
      timestamp: new Date(),
      commandName: command.name,
    };

    this.commandLog.push(entry);
  }

  /**
   * Enables or disables logging of matched commands.
   * 
   * @param {boolean} enable - True to enable logging, false to disable
   */
  public toggleLogging(enable: boolean): void {
    this.enabled = enable;
  }

  /**
   * Sets a callback function to be invoked when commands are matched.
   * The callback receives the matched commands and the original transcription.
   * 
   * @param {function} callback - Function to call when commands are matched
   */
  public setOnCommandMatched(callback: (commands: GameCommand[], transcription: string) => void): void {
    this.onCommandMatched = callback;
  }

  /**
   * Clears the callback function.
   */
  public clearOnCommandMatched(): void {
    this.onCommandMatched = undefined;
  }
}
/**
 * Represents a single entry in the command log.
 */
export interface CommandLogEntry {
  /** When the command was matched */
  timestamp: Date;
  /** The name of the matched command */
  commandName: string;
}
