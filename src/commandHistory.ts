export type Command = string;

class CommandHistory {
  // All commands in order — can grow without a cap. 
  private history: Command[] = [];

  //If false, ignore new commands
  private enabled = true;

  //Turn logging on/off.
  toggle(enable: boolean) {
    this.enabled = enable;
  }

  // Add new commands here
  add(command: Command) {
    if (!this.enabled) return;
    this.history.push(command);
  }

  //Snapshot of everything 
  getAll(): Command[] {
    return [...this.history];
  }

  // total count
  size(): number {
    return this.history.length;
  }

  
    // Efficient slice for big lists: returns history[start, end)
    // the display show only the latest 200 in the UI, but stores everything in memory. If we decide the we need storage we will then implement it
   
  getSlice(start: number, end?: number): Command[] {
    const s = Math.max(0, start);
    const e = Math.min(this.history.length, end ?? this.history.length);
    if (s >= e) return [];
    return this.history.slice(s, e);
  }

  /** Remove everything. */
  clear() {
    this.history = [];
  }
}

export const commandHistory = new CommandHistory();
export type { Command as CommandHistoryItem };
