/**
 * Logging System for AAC Voice API
 * 
 * This module provides comprehensive session logging for voice transcriptions,
 * command matching, synonym resolution, and confidence tracking.
 * 
 * **When to use `Logger` vs `CommandHistory`:**
 * 
 * - **Use `Logger`** for comprehensive session analytics including:
 *   - Full transcription text with timestamps
 *   - Detailed synonym resolution tracking (library vs API)
 *   - Confidence scores for all matches
 *   - Error messages for debugging
 *   - JSON export capabilities for data analysis
 *   - Multi-speaker support in online mode
 *   - Suitable for researchers, developers, and analytics
 * 
 * - **Use `CommandHistory`** (see CommandHistory.ts) for:
 *   - Lightweight command-only tracking
 *   - UI features like command history popup
 *   - Simple execution tracking without context
 *   - End-user facing features
 * 
 * @module Logging
 */

/**
 * Details about a matched command within a transcription.
 * Records how the command was matched and its execution result.
 */
export interface MatchedCommand {
  /** Name of the command that was matched */
  commandName: string;
  
  /** The actual word from the transcription that triggered the match */
  matchedWord: string;
  
  /** The synonym word that was used to match (only for synonym matches) */
  matchedSynonym?: string;
  
  /** Source of the match */
  synonymSource: 'direct' | 'library-synonym' | 'api-synonym' | 'phonetic';
  
  /** Confidence level of the match (0-1 scale, where 1 is 100% confident) */
  confidence: number;
  
  /** Whether the command executed successfully or failed */
  status: 'success' | 'failed';
  
  /** Error message if command execution failed (only for failed status) */
  error?: string;
}

/**
 * A complete log entry representing one transcription and its matched commands.
 * Uses pending pattern: created → matches added → finalized.
 */
export interface LogEntry {
  /** Sequential numeric ID for this log entry */
  id: number;
  
  /** ISO 8601 timestamp when the transcription was received */
  timestamp: string;
  
  /** The full transcribed text from speech recognition */
  transcriptionText: string;
  
  /** Speaker identifier (only available in online multi-speaker mode) */
  speakerId?: string;
  
  /** Array of all commands that were matched in this transcription */
  matchedCommands: MatchedCommand[];
  
  /** Whether this entry has been finalized (locked from further modifications) */
  finalized: boolean;
}

/**
 * Configuration options for the Logger.
 */
export interface LoggerConfig {
  /** Maximum number of log entries to keep. When exceeded, oldest entries are batch-pruned. */
  maxLogSize?: number;
  
  /** Number of entries to remove when pruning (batch size) */
  pruneCount?: number;
}

/**
 * Internal tracking for pending entries with auto-finalization.
 */
interface PendingEntry {
  entry: LogEntry;
  timeoutId: ReturnType<typeof setTimeout>;
}

/**
 * Logger singleton class for tracking voice command sessions.
 * 
 * Uses a pending entry pattern:
 * 1. `createEntry()` - Creates a new log entry and starts 60-second auto-finalization timer
 * 2. `addMatch()` - Appends matched commands to pending entry
 * 3. `finalizeEntry()` - Marks entry complete and prevents further modifications
 * 
 * Auto-finalization after 60 seconds helps prevent memory leaks from forgotten entries.
 * 
 * @example
 * ```typescript
 * const logger = Logger.getInstance();
 * 
 * // Start logging a transcription
 * const entryId = logger.createEntry("jump forward", "speaker-1");
 * 
 * // Add matched commands
 * logger.addMatch(entryId, {
 *   commandName: "jump",
 *   matchedWord: "jump",
 *   synonymSource: "direct",
 *   confidence: 1.0,
 *   status: "success"
 * });
 * 
 * // Finalize when done
 * logger.finalizeEntry(entryId);
 * 
 * // Export to JSON
 * const json = logger.exportToJSON();
 * ```
 */
export class Logger {
  /** Singleton instance */
  private static instance: Logger;
  
  /** All log entries (both pending and finalized) */
  private entries: Map<number, LogEntry>;
  
  /** Pending entries with auto-finalization timeouts */
  private pendingEntries: Map<number, PendingEntry>;
  
  /** Sequential ID counter */
  private nextId: number;
  
  /** Configuration */
  private config: Required<LoggerConfig>;
  
  /** Auto-finalization timeout in milliseconds (60 seconds) */
  private readonly AUTO_FINALIZE_TIMEOUT = 60000;

  /** Private constructor for singleton pattern */
  private constructor(config: LoggerConfig = {}) {
    this.entries = new Map();
    this.pendingEntries = new Map();
    this.nextId = 1;
    this.config = {
      maxLogSize: config.maxLogSize ?? Infinity,
      pruneCount: config.pruneCount ?? 10
    };
  }

  /**
   * Gets the singleton instance of Logger.
   * @returns The Logger instance
   */
  public static getInstance(config?: LoggerConfig): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(config);
    }
    return Logger.instance;
  }

  /**
   * Creates a new log entry for a transcription.
   * Starts a 60-second auto-finalization timer.
   * 
   * @param transcriptionText - The transcribed speech text
   * @param speakerId - Optional speaker identifier (for multi-speaker mode)
   * @returns The numeric ID of the created entry
   * 
   * @example
   * ```typescript
   * const entryId = logger.createEntry("jump and run");
   * ```
   */
  public createEntry(transcriptionText: string, speakerId?: string): number {
    const id = this.nextId++;
    
    const entry: LogEntry = {
      id,
      timestamp: new Date().toISOString(),
      transcriptionText,
      speakerId,
      matchedCommands: [],
      finalized: false
    };

    this.entries.set(id, entry);

    // Start auto-finalization timer
    const timeoutId = setTimeout(() => {
      this.autoFinalizeEntry(id);
    }, this.AUTO_FINALIZE_TIMEOUT);

    this.pendingEntries.set(id, { entry, timeoutId });

    return id;
  }

  /**
   * Adds a matched command to a pending log entry.
   * Silently ignores if the entry is already finalized.
   * 
   * @param entryId - The ID of the log entry
   * @param matchDetails - Details about the matched command
   * 
   * @example
   * ```typescript
   * logger.addMatch(entryId, {
   *   commandName: "jump",
   *   matchedWord: "leap",
   *   matchedSynonym: "leap",
   *   synonymSource: "library-synonym",
   *   confidence: 1.0,
   *   status: "success"
   * });
   * ```
   */
  public addMatch(entryId: number, matchDetails: MatchedCommand): void {
    const entry = this.entries.get(entryId);
    
    if (!entry) {
      console.warn(`Logger: Cannot add match to non-existent entry ${entryId}`);
      return;
    }

    if (entry.finalized) {
      // Silently ignore attempts to modify finalized entries
      return;
    }

    entry.matchedCommands.push(matchDetails);
  }

  /**
   * Finalizes a log entry, preventing further modifications.
   * Clears the auto-finalization timeout.
   * 
   * @param entryId - The ID of the log entry to finalize
   * 
   * @example
   * ```typescript
   * logger.finalizeEntry(entryId);
   * ```
   */
  public finalizeEntry(entryId: number): void {
    const entry = this.entries.get(entryId);
    
    if (!entry) {
      console.warn(`Logger: Cannot finalize non-existent entry ${entryId}`);
      return;
    }

    if (entry.finalized) {
      return; // Already finalized
    }

    entry.finalized = true;

    // Clear the auto-finalization timeout
    const pending = this.pendingEntries.get(entryId);
    if (pending) {
      clearTimeout(pending.timeoutId);
      this.pendingEntries.delete(entryId);
    }

    // Check if we need to prune old entries
    this.checkAndPrune();
  }

  /**
   * Auto-finalizes an entry when timeout is reached.
   * Logs a warning to help developers catch missing finalizeEntry() calls.
   * 
   * @private
   * @param entryId - The ID of the entry to auto-finalize
   */
  private autoFinalizeEntry(entryId: number): void {
    const entry = this.entries.get(entryId);
    
    if (!entry || entry.finalized) {
      return;
    }

    console.warn(
      `Logger: Entry ${entryId} was auto-finalized after 60 seconds. ` +
      `This may indicate a missing finalizeEntry() call. ` +
      `Transcription: "${entry.transcriptionText.substring(0, 50)}..."`
    );

    entry.finalized = true;
    this.pendingEntries.delete(entryId);

    // Check if we need to prune old entries
    this.checkAndPrune();
  }

  /**
   * Checks if log size exceeds limit and batch-prunes oldest entries if needed.
   * Removes multiple entries at once for efficiency.
   * 
   * @private
   */
  private checkAndPrune(): void {
    if (this.config.maxLogSize === Infinity) {
      return; // No limit set
    }

    const finalizedCount = Array.from(this.entries.values())
      .filter(e => e.finalized).length;

    if (finalizedCount > this.config.maxLogSize) {
      // Get all finalized entries sorted by ID (oldest first)
      const finalized = Array.from(this.entries.values())
        .filter(e => e.finalized)
        .sort((a, b) => a.id - b.id);

      // Batch prune oldest entries
      const entriesToRemove = finalized.slice(0, this.config.pruneCount);
      
      for (const entry of entriesToRemove) {
        this.entries.delete(entry.id);
      }

      console.log(
        `Logger: Pruned ${entriesToRemove.length} oldest entries ` +
        `(${finalizedCount} -> ${finalizedCount - entriesToRemove.length})`
      );
    }
  }

  /**
   * Gets all finalized log entries.
   * Returns an immutable copy to prevent external modifications.
   * 
   * @returns Array of finalized log entries
   * 
   * @example
   * ```typescript
   * const logs = logger.getAllLogs();
   * console.log(`Total logs: ${logs.length}`);
   * ```
   */
  public getAllLogs(): LogEntry[] {
    return Array.from(this.entries.values())
      .filter(entry => entry.finalized)
      .sort((a, b) => a.id - b.id)
      .map(entry => ({ ...entry, matchedCommands: [...entry.matchedCommands] }));
  }

  /**
   * Exports all finalized logs as a formatted JSON string.
   * Uses 2-space indentation for readability.
   * 
   * @returns Pretty-printed JSON string
   * 
   * @example
   * ```typescript
   * const json = logger.exportToJSON();
   * console.log(json);
   * ```
   */
  public exportToJSON(): string {
    const logs = this.getAllLogs();
    return JSON.stringify(logs, null, 2);
  }

  /**
   * Gets the log data as a plain JavaScript object.
   * Useful for Node.js environments where manual serialization is needed.
   * 
   * @returns Plain object containing all finalized log entries
   * 
   * @example
   * ```typescript
   * // Node.js usage
   * const fs = require('fs');
   * const logData = logger.getJSONBlob();
   * fs.writeFileSync('logs.json', JSON.stringify(logData, null, 2));
   * ```
   */
  public getJSONBlob(): LogEntry[] {
    return this.getAllLogs();
  }

  /**
   * Saves logs to a file using browser download.
   * Only works in browser environments.
   * 
   * @param filename - Name of the file to download
   * @throws Error if called in Node.js environment
   * 
   * @example
   * ```typescript
   * // Browser usage
   * logger.saveToFile('session-2024-01-15.json');
   * ```
   */
  public saveToFile(filename: string = 'aac-session-log.json'): void {
    // Check if we're in a browser environment
    if (typeof document === 'undefined') {
      throw new Error(
        'saveToFile() is only available in browser environments. ' +
        'Use getJSONBlob() for Node.js and handle file writing manually.'
      );
    }

    const json = this.exportToJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    
    // Clean up
    URL.revokeObjectURL(url);
  }

  /**
   * Clears all log entries and resets the ID counter.
   * Also cancels all pending auto-finalization timeouts.
   * 
   * @example
   * ```typescript
   * logger.clear(); // Start fresh
   * ```
   */
  public clear(): void {
    // Cancel all pending timeouts
    for (const pending of this.pendingEntries.values()) {
      clearTimeout(pending.timeoutId);
    }

    this.entries.clear();
    this.pendingEntries.clear();
    this.nextId = 1;
  }

  /**
   * Gets the total number of log entries (including pending).
   * 
   * @returns Total count of entries
   */
  public getTotalCount(): number {
    return this.entries.size;
  }

  /**
   * Gets the number of finalized entries.
   * 
   * @returns Count of finalized entries
   */
  public getFinalizedCount(): number {
    return Array.from(this.entries.values()).filter(e => e.finalized).length;
  }

  /**
   * Gets the number of pending (not yet finalized) entries.
   * 
   * @returns Count of pending entries
   */
  public getPendingCount(): number {
    return this.pendingEntries.size;
  }

  /**
   * Updates the configuration.
   * 
   * @param config - Partial configuration to update
   */
  public updateConfig(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }
}
