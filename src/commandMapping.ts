import { CommandLibrary, GameCommand } from './commandLibrary';

/**
 * CommandMapping provides a simple interface for developers to add and remove
 * commands from the CommandLibrary.
 *
 * This class allows you to:
 * - Create and add new commands to the library.
 * - Remove commands by name.
 * - Retrieve all commands or check if a command exists.
 * - Clear all commands from the library.
 *
 * Command names are case-insensitive and stored in lowercase.
 * Commands are stored in the CommandLibrary's HashMap.
 */
export class CommandMapping {
  /** Reference to the CommandLibrary singleton */
  private library: CommandLibrary;

  /**
   * Creates a new CommandMapping instance and connects to the CommandLibrary.
   */
  constructor() {
    this.library = CommandLibrary.getInstance();
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
   * @returns {boolean} Returns true if command was added successfully, false if duplicate or invalid
   */
  public addCommand(
    name: string,
    action: () => void,
    options?: {
      description?: string;
      active?: boolean;
      // icon?: unknown; // Uncomment if you reintroduce `icon` in the interface
    }
  ): boolean {
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
    if (ok) {
      console.log(`Command "${normalized}" added successfully`);
    } else {
      console.warn(`Failed to add command "${normalized}"`);
    }
    return ok;
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
   * Clears all commands from the CommandLibrary.
   *
   * @returns {void}
   */
  public clearAllCommands(): void {
    this.library.clear();
    console.log('All commands cleared');
  }
}

