/*Object representing game command with its associated properties.*/
interface GameCommand {
    /*name of the command*/
    name: string;
    /*callback function to execute the command*/
    action: () => void;
    /*description of the command*/
    description: string;
    /*icon representing the command*/
    // icon: void;
    /*whether the command is active or not*/
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
