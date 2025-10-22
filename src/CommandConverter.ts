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
   * - Automatically executes the command's action/callback function
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
          
          // Execute the command and log with status
          let status: 'success' | 'failed' = 'success';
          try {
            command.action();
          } catch (error) {
            status = 'failed';
            console.error(`Error executing command "${command.name}":`, error);
          }
          
          // Log the command with execution status
          this.logCommand(command, transcription, status);
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
   * @param {'success' | 'failed'} status - Whether the command callback executed successfully
   */
  private logCommand(command: GameCommand, originalText: string, status: 'success' | 'failed'): void {
    const entry: CommandLogEntry = {
      timestamp: new Date(),
      commandName: command.name,
      status: status,
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
}
/**
 * Represents a single entry in the command log.
 */
export interface CommandLogEntry {
  /** When the command was matched */
  timestamp: Date;
  /** The name of the matched command */
  commandName: string;
  /** Whether the callback executed successfully */
  status: 'success' | 'failed';
}
