/**
 * Represents a voice-activated command that can trigger game actions.
 * 
 * @interface GameCommand
 * @example
 * ```typescript
 * const jumpCommand: GameCommand = {
 *   name: "jump",
 *   action: () => player.jump(),
 *   description: "Makes the player character jump",
 *   active: true
 * };
 * ```
 */
export interface GameCommand {
    /**
     * The name/trigger phrase for the command.
     * This is the word or phrase that will be recognized to trigger the action.
     * 
     * @type {string}
     * @example "jump", "move left", "fire weapon"
     */
    name: string;

    /**
     * The callback function to execute when this command is triggered.
     * This function contains the game logic that should run when the voice command is recognized.
     * 
     * @type {() => void}
     * @example () => player.jump()
     */
    action: () => void;

    /**
     * A human-readable description of what this command does.
     * Used for documentation, help menus, or accessibility features.
     * 
     * @type {string}
     * @example "Makes the player character jump into the air"
     */
    description: string;

    /**
     * Whether this command is currently enabled and can be triggered.
     * Inactive commands will not respond to voice input.
     * 
     * @type {boolean}
     * @default true
     */
    active: boolean;
}

/**
 * CommandLibrary contains a HashMap that:
 * Maps synonyms to command names for flexible voice recognition
 * Can be called by CommandMapper.
 * Maps a String command to the corresponding GameCommand.
*/

export class CommandLibrary {
    private commandMap: Map<string, GameCommand>;
    private synonymMap: Map<string, string>;

    private static instance: CommandLibrary;

    constructor() {
        this.commandMap = new Map<string, GameCommand>();
        this.synonymMap = new Map<string, string>();
    }
    
    /**
     * @returns The singleton instance of CommandLibrary.
     */
    public static getInstance(): CommandLibrary {
        if (!CommandLibrary.instance) {
            CommandLibrary.instance = new CommandLibrary();
        }
        return CommandLibrary.instance;
    }

    private normalize(name: string): string {
        return name.toLowerCase().trim();
    }

    /** Add a command (returns false if name already exists) */
    public add(command: GameCommand): boolean {
        const key = this.normalize(command.name);
        if (!key) return false;
        if (this.commandMap.has(key)) return false;
        // store normalized name internally
        this.commandMap.set(key, { ...command, name: key, active: command.active ?? true });
        return true;
    }

/**
     * Adds a synonym mapping for a command.
     * Maps a synonym word to a command name.
     * 
     * Example: addSynonym("leap", "jump") means "leap" will trigger "jump" command
     * 
     * @param {string} synonym - The synonym word (e.g., "leap")
     * @param {string} commandName - The actual command name (e.g., "jump")
     * @returns {boolean} True if added successfully, false if synonym already exists or command doesn't exist
     */
    public addSynonym(synonym: string, commandName: string): boolean {
        const normalizedSynonym = this.normalize(synonym);
        const normalizedCommand = this.normalize(commandName);

        // Check if the command exists
        if (!this.commandMap.has(normalizedCommand)) {
            console.warn(`Cannot add synonym "${synonym}": command "${commandName}" does not exist`);
            return false;
        }

        // Don't allow the command name itself as a synonym (redundant)
        if (normalizedSynonym === normalizedCommand) {
            console.warn(`Cannot add synonym: "${synonym}" is the same as command name`);
            return false;
        }

        // Check if synonym already exists (pointing to a different command)
        if (this.synonymMap.has(normalizedSynonym)) {
            const existingCommand = this.synonymMap.get(normalizedSynonym);
            if (existingCommand !== normalizedCommand) {
                console.warn(`Synonym "${synonym}" already maps to "${existingCommand}"`);
                return false;
            }
            // Already points to the same command, no need to add again
            return true;
        }

        // Add the synonym mapping
        this.synonymMap.set(normalizedSynonym, normalizedCommand);
        console.log(`Synonym added: "${synonym}" → "${commandName}"`);
        return true;
    }

    /**
     * Adds multiple synonyms for a command at once.
     * 
     * @param {string[]} synonyms - Array of synonym words
     * @param {string} commandName - The command name they should map to
     * @returns {number} Number of synonyms successfully added
     */
    public addSynonyms(synonyms: string[], commandName: string): number {
        let count = 0;
        for (const synonym of synonyms) {
            if (this.addSynonym(synonym, commandName)) {
                count++;
            }
        }
        return count;
    }

    /**
     * Removes a command by name.
     * Also removes all synonyms that point to this command.
     * 
     * @param {string} name - The command name to remove
     * @returns {boolean} True if removed, false if not found
     */
    public remove(name: string): boolean {
        const normalized = this.normalize(name);
        
        // Remove the command
        const removed = this.commandMap.delete(normalized);
        
        if (removed) {
            // Remove all synonyms that point to this command
            const synonymsToRemove: string[] = [];
            for (const [synonym, commandName] of this.synonymMap.entries()) {
                if (commandName === normalized) {
                    synonymsToRemove.push(synonym);
                }
            }
            
            for (const synonym of synonymsToRemove) {
                this.synonymMap.delete(synonym);
            }
            
            console.log(`Removed command "${name}" and ${synonymsToRemove.length} synonym(s)`);
        }
        
        return removed;
    }

    /** Check if a command exists */
    public has(name: string): boolean {
        return this.commandMap.has(this.normalize(name));
    }

    /** Get a command by name */
    public get(name: string): GameCommand | undefined {
        return this.commandMap.get(this.normalize(name));
    }

    /**
     * Finds a command by checking if the word is a synonym.
     * Returns the command that the synonym points to.
     * 
     * Example: findCommandBySynonym("leap") returns the "jump" command
     * 
     * @param {string} word - The word to look up (could be a synonym)
     * @returns {GameCommand | undefined} The command if the word is a registered synonym
     */
    public findCommandBySynonym(word: string): GameCommand | undefined {
        const normalized = this.normalize(word);
        
        // Check if this word is a synonym
        const commandName = this.synonymMap.get(normalized);
        
        if (commandName) {
            // Return the actual command
            return this.commandMap.get(commandName);
        }
        
        return undefined;
    }

    /**
     * Gets all synonyms for a specific command.
     * 
     * @param {string} commandName - The command name
     * @returns {string[]} Array of synonyms that map to this command
     */
    public getSynonymsForCommand(commandName: string): string[] {
        const normalized = this.normalize(commandName);
        const synonyms: string[] = [];
        
        for (const [synonym, command] of this.synonymMap.entries()) {
            if (command === normalized) {
                synonyms.push(synonym);
            }
        }
        
        return synonyms;
    }

    /** List all commands */
    public list(): GameCommand[] {
        return Array.from(this.commandMap.values());
    }

    /** Clear all commands */
    public clear(): void {
        this.commandMap.clear();
        this.synonymMap.clear();
    }

    /**
     * Gets the total number of synonyms stored.
     * 
     * @returns {number} Number of synonym mappings
     */
    public getSynonymCount(): number {
        return this.synonymMap.size;
    }
}
