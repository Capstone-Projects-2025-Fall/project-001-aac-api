import { CommandLibrary, GameCommand } from './commandLibrary';
import { SynonymResolver } from './SynonymResolver';

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
   * @returns {Promise<boolean>} Returns true if command was added successfully, false if duplicate or invalid
   */
  public async addCommand(
    name: string,
    action: () => void,
    options?: {
      description?: string;
      active?: boolean;
      fetchSynonyms?: boolean;
      // icon?: unknown; // Uncomment if you reintroduce `icon` in the interface
    }
  ): Promise<boolean> {
    const normalized = this.normalize(name);

    if (!normalized) {
      console.error('Command name cannot be empty');
      return false;
    }

    if (this.library.has(normalized)) {
      console.warn(`Command "${normalized}" already exists`);
      return false;
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
      return false;
    }

    console.log(`Command "${normalized}" added successfully`);

    // Fetch and register synonyms if enabled (default: true)
    const fetchSynonyms = options?.fetchSynonyms ?? true;
    
    if (fetchSynonyms) {
      // Fetch synonyms asynchronously (doesn't block command registration)
      this.fetchAndRegisterSynonyms(normalized).catch(error => {
        console.error(`Error fetching synonyms for "${normalized}":`, error);
      });
    }

    return true;
  }

  /**
   * Fetches synonyms from the API and registers them in the CommandLibrary.
   * This is called automatically by addCommand() unless fetchSynonyms is disabled.
   * 
   * @private
   * @param {string} commandName - The command name to fetch synonyms for
   * @returns {Promise<void>}
   */
  private async fetchAndRegisterSynonyms(commandName: string): Promise<void> {
    console.log(`Fetching synonyms for "${commandName}"...`);
    
    try {
      // Get synonyms from the API (cached if already fetched)
      const synonyms = await this.synonymResolver.getSynonyms(commandName);
      
      if (synonyms.length === 0) {
        console.log(`No synonyms found for "${commandName}"`);
        return;
      }

      // Register all synonyms in the library
      const count = this.library.addSynonyms(synonyms, commandName);
      
      console.log(`Registered ${count} synonym(s) for "${commandName}": ${synonyms.slice(0, 5).join(', ')}${synonyms.length > 5 ? '...' : ''}`);
    } catch (error) {
      console.error(`Failed to fetch synonyms for "${commandName}":`, error);
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

