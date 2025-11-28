import { CommandLibrary, GameCommand } from './commandLibrary';
import { CommandHistory, CommandLogEntry } from './CommandHistory';
import { ConfidenceMatcher } from './ConfidenceMatcher';
import { SynonymResolver } from './SynonymResolver';

/**
 * CommandConverter processes transcribed text in real-time, tokenizes it,
 * and matches words against the CommandLibrary.
 * 
 * This class:
 * - Tokenizes incoming transcription text into individual words
 * - Normalizes and cleans tokens (lowercase, trim, remove punctuation)
 * - Checks each token against the CommandLibrary
 * - Uses SynonymResolver to check for synonym matches
 * - Sends matched commands to CommandHistory with timestamps
 * - Automatically executes matched commands
 * - Invokes callback when commands are matched
 */
export class CommandConverter {
  /** Reference to the CommandLibrary for looking up commands */
  private library: CommandLibrary;

  /** Reference to CommandHistory for logging matched commands */
  private commandHistory: CommandHistory;

  /** Reference to ConfidenceMatcher for phonetic matching */
  private confidenceMatcher: ConfidenceMatcher;

  /** Reference to SynonymResolver for synonym matching */
  private synonymResolver: SynonymResolver;

  /** Callback function invoked when commands are matched */
  private onCommandMatched?: (commands: GameCommand[], transcription: string) => void;

  /** The single global instance of CommandConverter */
  private static instance: CommandConverter;

  /** Private constructor prevents direct instantiation */
  private constructor() {
    this.library = CommandLibrary.getInstance();
    this.commandHistory = CommandHistory.getInstance();
    this.confidenceMatcher = new ConfidenceMatcher();
    this.synonymResolver = SynonymResolver.getInstance();
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
   * Gets the confidence matcher instance for configuration
   * @returns {ConfidenceMatcher} The confidence matcher instance
   */
  public getConfidenceMatcher(): ConfidenceMatcher {
    return this.confidenceMatcher;
  }

  /**
   * Gets the synonym resolver instance
   * @returns {SynonymResolver} The synonym resolver instance
   */

  public getSynonymResolver(): SynonymResolver {
    return this.synonymResolver;
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
   * Attempts to find a command match for a given token.
   * Checks in order:
   * 1. Direct match in library
   * 2. Synonym match in library's synonym map
   * 3. API-based synonym match using SynonymResolver
   * 
   * @private
   * @param {string} token - The word token to match
   * @returns {Promise<GameCommand | null>} The matched command or null
   */
  private async findCommandMatch(token: string): Promise<GameCommand | null> {
    // 1. Check for direct command match
    const directMatch = this.library.get(token);
    if (directMatch) {
      return directMatch;
    }

    // 2. Check for registered synonym match
    const synonymMatch = this.library.findCommandBySynonym(token);
    if (synonymMatch) {
      return synonymMatch;
    }

    // 3. Check for API-based synonym match
    // Get all registered command names
    const registeredCommands = this.library.list().map(cmd => cmd.name);
    
    // Check if the spoken word is a synonym of any registered command
    for (const commandName of registeredCommands) {
      const areSynonyms = await this.synonymResolver.areSynonyms(token, commandName);
      if (areSynonyms) {
        console.log(`Synonym match found: "${token}" → "${commandName}"`);
        return this.library.get(commandName) || null;
      }
    }

    return null;
  }

  /**
   * Processes new transcription text by tokenizing it and checking
   * each token against the CommandLibrary using multiple matching strategies:
   * - Direct command match
   * - Registered synonym match
   * - API-based synonym match
   * - Confidence/phonetic matching
   *
   * For each matched command:
   * - Logs it to the command log with a timestamp
   * - Automatically executes the command's action/callback function
   *
   * @param {string} transcription - The new transcribed text from getTranscribed()
   * @returns {Promise<GameCommand[]>} Array of matched commands found in the transcription
   */
  public async processTranscription(transcription: string): Promise<GameCommand[]> {
    if (!transcription || !transcription.trim()) {
      return [];
    }

    const tokens = this.tokenize(transcription);
    const matchedCommands: GameCommand[] = [];
    const processedCommandNames = new Set<string>(); // Prevent duplicate executions

    for (const token of tokens) {
      // Use confidence matcher to find matches
      const synonymMatch = await this.findCommandMatch(token);

      if (synonymMatch && !processedCommandNames.has(synonymMatch.name)) {
        matchedCommands.push(synonymMatch);
        processedCommandNames.add(synonymMatch.name);

        // Execute the command and log with status
        let status: 'success' | 'failed' = 'success';
        try {
          synonymMatch.action();
        } catch (error) {
          status = 'failed';
          console.error(`Error executing command "${synonymMatch.name}":`, error);
        }

        // Log the command with execution status and confidence info
        // Log as exact match since synonym was found
        this.logCommand(synonymMatch, transcription, status, 1.0, true);
        continue;
      }

      const confidenceMatch = this.confidenceMatcher.findMatch(token, this.library);

      if (confidenceMatch && !processedCommandNames.has(confidenceMatch.command.name)) {
        const command = confidenceMatch.command;
        matchedCommands.push(command);
        processedCommandNames.add(command.name);

        // Execute the command and log with status
        let status: 'success' | 'failed' = 'success';
        try {
          command.action();
        } catch (error) {
          status = 'failed';
          console.error(`Error executing command "${command.name}":`, error);
        }

        // Log the command with execution status and confidence info
        this.logCommand(
          command,
          transcription,
          status,
          confidenceMatch.confidence,
          confidenceMatch.isExactMatch
        );
      }
    }

    // Invoke callback if commands were matched 
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
   * @param confidence - The level of confidence {0-1} of the match. (0.7 == 70%)
   * @param isExactMatch - Whether the command is an exact match or not (confidence level == 100%)
   */
  private logCommand(command: GameCommand, originalText: string, status: 'success' | 'failed', confidence: number = 1.0, isExactMatch: boolean = true): void {
    const entry: CommandLogEntry = {
      timestamp: new Date(),
      commandName: command.name,
      status: status,
      confidence: confidence,
      matchType: isExactMatch ? 'exact' : 'phonetic'
    };

    this.commandHistory.add(entry);
  }
}
