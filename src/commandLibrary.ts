/*Object representing game command with its associated properties.*/
interface GameCommand {
    /*name of the command*/
    name: string;
    /*callback function to execute the command*/
    cbfunction: () => void;
    /*description of the command*/
    description: string;
    /*icon representing the command*/
    // icon; commented out for now, dunno how we're doing this
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
}
