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
 * Can be called by CommandMapper.
 * Maps a String command to the corresponding GameCommand.
*/

export class CommandLibrary {
    private commandMap: Map<string, GameCommand>;

    private static instance: CommandLibrary;

    constructor() {
        this.commandMap = new Map<string, GameCommand>();
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

    /** Remove a command by name */
    public remove(name: string): boolean {
        return this.commandMap.delete(this.normalize(name));
    }

    /** Check if a command exists */
    public has(name: string): boolean {
        return this.commandMap.has(this.normalize(name));
    }

    /** Get a command by name */
    public get(name: string): GameCommand | undefined {
        return this.commandMap.get(this.normalize(name));
    }

    /** List all commands */
    public list(): GameCommand[] {
        return Array.from(this.commandMap.values());
    }

    /** Clear all commands */
    public clear(): void {
        this.commandMap.clear();
    }
}
