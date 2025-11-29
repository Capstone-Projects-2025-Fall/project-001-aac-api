import { CommandLibrary, GameCommand } from './commandLibrary';
import { SynonymResolver } from './SynonymResolver';

/**
 * Result object returned when adding a command with synonym fetching.
 * Provides developers with information about what synonyms were registered.
 */
export interface CommandAddResult {
  /** Whether the command was successfully added */
  success: boolean;
  /** The command name that was added */
  commandName: string;
  /** Array of synonyms that were successfully registered */
  synonymsMapped: string[];
  /** Total number of synonyms mapped */
  synonymCount: number;
  /** Error message if command addition failed */
  error?: string;
}
/**
 * CommandMapping provides a simple interface for developers to add and remove
 * commands from the CommandLibrary.
 *
 * This class allows you to:
 * - Create and add new commands to the library.
 * - Automatically fetch and register synonyms for commands
 * - Remove commands by name.
 * - Retrieve all commands or check if a command exists.
 * - Clear all commands from the library.
 *
 * Command names are case-insensitive and stored in lowercase.
 * Commands are stored in the CommandLibrary's HashMap.
 * Synonyms are automatically fetched from DataMuse API unless disabled.
 */
export class CommandMapping {
  /** Reference to the CommandLibrary singleton */
  private library: CommandLibrary;
  private synonymResolver: SynonymResolver;

  /**
   * Creates a new CommandMapping instance and connects to the CommandLibrary.
   */
  constructor() {
    this.library = CommandLibrary.getInstance();
    this.synonymResolver = SynonymResolver.getInstance();
  }

  /**
   * Normalizes a command name to lowercase and trims whitespace.
   *
   * @param {string} name - The command name to normalize
   * @returns {string} The normalized command name
   */
  private normalize(name: string): string {
    return name.toLowerCase().trim();
  }

  /**
   * Creates and adds a new command to the CommandLibrary.
   *
   * If a command with the same name already exists, it will not be added.
   * The command name is case-insensitive and will be stored in lowercase.
   *
   * @param {string} name - Command name (case-insensitive)
   * @param {() => void} action - Callback function to execute for this command
   * @param {Object} options - Optional configuration object
   * @param {string} options.description - Description of what the command does
   * @param {boolean} options.active - Whether the command is active (default: true)
   * @param {boolean} options.fetchSynonyms - Whether to auto-fetch synonyms (default: true)
   * @returns {Promise<CommandAddResult>} Result object with command and synonym information
   */
  public async addCommand(
    name: string,
    action: () => void,
    options?: {
      description?: string;
      active?: boolean;
      fetchSynonyms?: boolean;
    }
  ): Promise<CommandAddResult> {
    const normalized = this.normalize(name);

    if (!normalized) {
      console.error('Command name cannot be empty');
      return {
        success: false,
        commandName: name,
        synonymsMapped: [],
        synonymCount: 0,
        error: 'Command name cannot be empty'
      };
    }

    if (this.library.has(normalized)) {
      console.warn(`Command "${normalized}" already exists`);
      return {
        success: false,
        commandName: normalized,
        synonymsMapped: [],
        synonymCount: 0,
        error: `Command "${normalized}" already exists`
      };
    }

    const cmd: GameCommand = {
      name: normalized,
      action,
      description: options?.description ?? '',
      active: options?.active ?? true,
    };

    const ok = this.library.add(cmd);

    if (!ok) {
      console.warn(`Failed to add command "${normalized}"`);
      return {
        success: false,
        commandName: normalized,
        synonymsMapped: [],
        synonymCount: 0,
        error: `Failed to add command "${normalized}"`
      };
    }

    console.log(`Command "${normalized}" added successfully`);

    // Fetch and register synonyms if enabled (default: true)
    const fetchSynonyms = options?.fetchSynonyms ?? true;
    let synonymsMapped: string[] = [];

    if (fetchSynonyms) {
      try {
        synonymsMapped = await this.fetchAndRegisterSynonyms(normalized);
      } catch (error) {
        console.error(`Error fetching synonyms for "${normalized}":`, error);
      }
    }


    return {
      success: true,
      commandName: normalized,
      synonymsMapped: synonymsMapped,
      synonymCount: synonymsMapped.length
    };
  }

  /**
   * Fetches synonyms from the API and registers them in the CommandLibrary.
   * This is called automatically by addCommand() unless fetchSynonyms is disabled.
   *
   * @private
   * @param {string} commandName - The command name to fetch synonyms for
   * @returns {Promise<string[]>}
   */
  private async fetchAndRegisterSynonyms(commandName: string): Promise<string[]>{
    console.log(`Fetching synonyms for "${commandName}"...`);

    try {
      // Get synonyms from the API (cached if already fetched)
      const synonyms = await this.synonymResolver.getSynonyms(commandName);

      if (synonyms.length === 0) {
        console.log(`No synonyms found for "${commandName}"`);
        return [];
      }

      // Register all synonyms in the library
      const successfullyAdded: string[] = [];

      for (const synonym of synonyms) {
        const added = this.library.addSynonym(synonym, commandName);
        if (added) {
          successfullyAdded.push(synonym);
        }
      }
      console.log(
        `Registered ${successfullyAdded.length} synonym(s) for "${commandName}": ` +
        `${successfullyAdded.slice(0, 5).join(', ')}${successfullyAdded.length > 5 ? '...' : ''}`
      );

      return successfullyAdded;
    } catch (error) {
      console.error(`Failed to fetch synonyms for "${commandName}":`, error);
      return [];
    }
  }

      
      
  /**
   * Manually adds a synonym for an existing command.
   * Use this to add custom synonyms that aren't in the API.
   *
   * @param {string} synonym - The synonym word
   * @param {string} commandName - The command it should trigger
   * @returns {boolean} True if synonym was added successfully
   *
   * @example
   * ```ts
   * mapper.addSynonym('hop', 'jump');  // Now "hop" triggers "jump" command
   * ```
   */
  public addSynonym(synonym: string, commandName: string): boolean {
    return this.library.addSynonym(synonym, commandName);
  }

  /**
   * Manually adds multiple synonyms for an existing command.
   *
   * @param {string[]} synonyms - Array of synonym words
   * @param {string} commandName - The command they should trigger
   * @returns {number} Number of synonyms successfully added
   *
   * @example
   * ```ts
   * mapper.addSynonyms(['hop', 'leap', 'spring'], 'jump');
   * ```
   */
  public addSynonyms(synonyms: string[], commandName: string): number {
    return this.library.addSynonyms(synonyms, commandName);
  }

  /**
   * Gets all synonyms for a specific command.
   *
   * @param {string} commandName - The command name
   * @returns {string[]} Array of synonyms
   *
   * @example
   * ```ts
   * const synonyms = mapper.getSynonymsForCommand('jump');
   * console.log(synonyms);  // ['leap', 'hop', 'bound', ...]
   * ```
   */
  public getSynonymsForCommand(commandName: string): string[] {
    return this.library.getSynonymsForCommand(commandName);
  }

  /**
   * Gets a detailed mapping of all commands and their synonyms.
   * Useful for debugging or displaying to developers.
   *
   * @returns {Map<string, string[]>} Map of command names to their synonym arrays
   *
   * @example
   * ```ts
   * const mapping = mapper.getAllSynonymMappings();
   * for (const [command, synonyms] of mapping.entries()) {
   *   console.log(`${command}: ${synonyms.join(', ')}`);
   * }
   * // Output:
   * // jump: leap, hop, spring, bound
   * // run: sprint, jog, dash
   * ```
   */
  public getAllSynonymMappings(): Map<string, string[]> {
    const mappings = new Map<string, string[]>();
    const commands = this.library.list();

    for (const command of commands) {
      const synonyms = this.library.getSynonymsForCommand(command.name);
      if (synonyms.length > 0) {
        mappings.set(command.name, synonyms);
      }
    }

    return mappings;
  }

  /**
   * Removes a command from the CommandLibrary by name.
   *
   * The command name is case-insensitive.
   *
   * @param {string} name - The name of the command to remove
   * @returns {boolean} Returns true if command was removed, false if not found
   */
  public removeCommand(name: string): boolean {
    const normalized = this.normalize(name);
    const ok = this.library.remove(normalized);

    if (ok) {
      console.log(`Command "${normalized}" removed successfully`);
    } else {
      console.warn(`Command "${normalized}" not found`);
    }
    return ok;
  }

  /**
   * Retrieves all command names from the CommandLibrary.
   *
   * @returns {string[]} Array of all command names
   */
  public getAllCommands(): string[] {
    return this.library.list().map(c => c.name);
  }

  /**
   * Checks if a command exists in the CommandLibrary.
   *
   * @param {string} name - The name of the command to check
   * @returns {boolean} True if command exists, false otherwise
   */
  public hasCommand(name: string): boolean {
    return this.library.has(name);
  }

  /**
   * Retrieves a specific command from the CommandLibrary by name.
   *
   * @param {string} name - The name of the command to retrieve
   * @returns {GameCommand | undefined} The GameCommand object if found, undefined otherwise
   */
  public getCommand(name: string): GameCommand | undefined {
    return this.library.get(name);
  }

  /**
   * Clears all commands and synonyms from the CommandLibrary.
   *
   * @returns {void}
   */
  public clearAllCommands(): void {
    this.library.clear();
    console.log('All commands and synonyms cleared');
  }

  /**
   * Gets the total number of synonym mappings registered.
   *
   * @returns {number} Number of synonyms
   */
  public getSynonymCount(): number {
    return this.library.getSynonymCount();
  }
}

