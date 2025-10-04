/**
 * CommandHistory keeps track of a chronological log of commands.
 * 
 * This class allows you to:
 * - Add new commands to the history (if logging is enabled).
 * - Retrieve all commands or a slice of commands.
 * - Query the total number of commands logged.
 * - Enable or disable logging.
 * - Clear the entire history.
 * 
 * Commands are stored in memory in the order they were added. 
 * Slices and retrievals return copies of the array to prevent external mutation.
 * There is no built-in limit on how many commands are stored.
 */

export class CommandHistory {
  /**All commands in order — can grow without a cap. */ 
  private history: string[] = [];

  /**  If false, ignore new commands */
  private enabled = true;

  /**
   * 
   * @param enable Turn logging on/off.
   * @returns {void}
   */
  public toggle(enable: boolean):void {
    this.enabled = enable;
  }

  /**
   * Adds a new command to the Command History Log if Logging has been turned on
   * 
   * @param command Adds a new command to the array
   * @returns {void}
   */
  public add(command: string):void{
    if (!this.enabled) return;
    this.history.push(command);
  }


  /**
   * Returns all logged Commands
   * 
   * @returns {string[]} returns a copy of the history that is immutable
   */
  public getAll(): string[] {
    return [...this.history];
  }

  /**
   * Returns a number of commands that have been logged
   * 
   * @returns { number } The number of commands that have been logged
   */
  public getSize(): number {
    return this.history.length;
  }

  // Efficient slice for big lists: returns history[start, end)
  // the display show only the latest 200 in the UI, but stores everything in memory. If we decide the we need storage we will then implement it

  /**
   * Returns a portion of the command history as a new array.
   * 
   * 
   * @param {number}start Starting position of commands you want to have returned
   * @param {number} end Ending position of the commands you want to have returned
   * @returns {string[]} If the starting slice is larger then the end it will return an empty array otherwise it returns a list of the commands from the starting index to the ending index
   */
  public getSlice(start: number, end?: number): string[] {
    const s = Math.max(0, start);
    const e = Math.min(this.history.length, end ?? this.history.length);
    if (s >= e) return [];
    return this.history.slice(s, e);
  }

  /**
   * Clears all history 
   * 
   * @returns {void}
   */
  public clear():void {
    this.history = [];
  }
}


