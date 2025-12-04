// @ts-expect-error package made for JavaScript and not TypeScript
import { compareTwoTexts } from "text-sound-similarity-improved";
import { ConfidenceConfig, DEFAULT_CONFIDENCE_CONFIG } from "./ConfidenceConfig";
import { CommandLibrary, GameCommand } from './commandLibrary';

export interface MatchResult {
  command: GameCommand,
  confidence: number,
  matchedWord: string, // the word from the transcription that matched
  isExactMatch: boolean,
}

export class ConfidenceMatcher {
  private config: ConfidenceConfig;

  constructor(config: Partial<ConfidenceConfig> = {}) {
    this.config = { ...DEFAULT_CONFIDENCE_CONFIG, ...config };
  }

  /**
   * Updates the configuration
   */
  public updateConfig(config: Partial<ConfidenceConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Finding a matching command for a single token
   * First looks for exact match (100% confidence)
   * If it does not find match, then uses similarity matching
   *
   * @param token A normalized word token
   * @param commandLibrary the command library to search
   * @returns speechSynthesis first matching command or null
   */
  public findMatch(token: string, commandLibrary: CommandLibrary): MatchResult | null {
    if (commandLibrary.has(token)) {
      const command = commandLibrary.get(token);
      if (command && command.active) {
        if (this.config.logConfidenceScore) {
          console.log(`[Exact Match] "${token}" -> "${command.name}" (100%)`);
        }
        return {
          command,
          confidence: 1.0,
          matchedWord: token,
          isExactMatch: true
        };
      }
    }

    if (!this.config.usePhoneticMatching) {
      return null;
    }

    return this.findPhoneticMatch(token, commandLibrary);
  }

  /**
   * Find the first command that meets the confidence threshold
   */
  private findPhoneticMatch(token: string, commandLibrary: CommandLibrary):MatchResult | null {
    const allCommands = commandLibrary.list();

    for (const command of allCommands) {
      if (!command.active) {
        continue;
      }

      const similarity = compareTwoTexts(token, command.name);
      const threshold = this.config.globalThreshold;

      if (similarity >= threshold) {
        if (this.config.logConfidenceScore) {
          console.log(`[Phonetic Match] "${token}" -> "${command.name}" (${(similarity * 100).toFixed(1)}%)`);
        }
        return {
          command,
          confidence: similarity,
          matchedWord: token,
          isExactMatch: false
        };
      }
    }

    if (this.config.logConfidenceScore) {
      console.log(`[No Match] "${token}" - no commands met threshold`);
    }

    return null;
  }

  /**
   * Get the current global threshold
   */
  public getGlobalThreshold(): number {
    return this.config.globalThreshold;
  }

  /**
   * Set a new global threshold
   */
  public setGlobalThreshold(threshold: number): void {
    if (threshold < 0 || threshold > 1) {
      throw new Error('Threshold must be between 0 and 1');
    }
    this.config.globalThreshold = threshold;
  }

  /**
   * Check if phonetic matching is enabled
   */
  public isPhoneticMatchingEnabled(): boolean {
    return this.config.usePhoneticMatching;
  }

  /**
   * Enable or disable phonetic matching
   */
  public setPhoneticMatching(enabled: boolean): void {
    this.config.usePhoneticMatching = enabled;
  }

  /**
   * Enable or disable confidence score logging
   */
  public setLogging(enabled: boolean): void {
    this.config.logConfidenceScore = enabled;
  }

}

