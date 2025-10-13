import { describe, it, expect, beforeEach } from 'vitest';
import { CommandMapping } from '../src/commandMapping';
import { CommandLibrary } from '../src/commandLibrary';

describe('CommandMapping <-> CommandLibrary integration', () => {
  // Clean slate before each test so we don't get weird carryover issues
  beforeEach(() => {
    CommandLibrary.getInstance().clear();
  });

  it('adds a command into the library and can retrieve it', () => {
    const mapper = new CommandMapping();
    
    // Try adding a Jump command - should work fine
    const added = mapper.addCommand('Jump', () => {/* no-op */}, { 
      description: 'Make avatar jump', 
      active: true 
    });
    
    expect(added).toBe(true);
    expect(mapper.hasCommand('jump')).toBe(true); // should find it even with lowercase
    
    // Now check if it actually made it into the library
    const lib = CommandLibrary.getInstance();
    const cmd = lib.get('jump');
    
    expect(cmd).toBeDefined();
    expect(cmd?.name).toBe('jump'); // normalized to lowercase
    expect(typeof cmd?.action).toBe('function'); // make sure the action is actually a function
    expect(cmd?.description).toBe('Make avatar jump');
    expect(cmd?.active).toBe(true);
  });

  it('rejects duplicates by name (case-insensitive)', () => {
    const mapper = new CommandMapping();
    
    // Add "Attack" first
    const first = mapper.addCommand('Attack', () => {}, { description: 'Atk' });
    // Try adding "attack" again - should fail because it's the same command
    const second = mapper.addCommand('attack', () => {}, { description: 'Duplicate' });
    
    expect(first).toBe(true);
    expect(second).toBe(false); // nope, no duplicates allowed through this. 
    
    // Double check the library only has one command
    const lib = CommandLibrary.getInstance();
    const all = lib.list();
    expect(all.length).toBe(1);
    expect(all[0].name).toBe('attack'); // normalized
    expect(all[0].description).toBe('Atk'); // kept the original description
  });

  it('removes an existing command', () => {
    const mapper = new CommandMapping();
    
    // Add a defend command
    mapper.addCommand('Defend', () => {}, { description: 'Block' });
    expect(mapper.hasCommand('defend')).toBe(true);
    
    // Remove it using uppercase (testing case-insensitivity)
    const removed = mapper.removeCommand('DEFEND');
    
    expect(removed).toBe(true);
    expect(mapper.hasCommand('defend')).toBe(false); // should be gone now
    
    // Make sure it's actually removed from the library too
    const lib = CommandLibrary.getInstance();
    expect(lib.get('defend')).toBeUndefined();
  });

  it('lists all commands (normalized names)', () => {
    const mapper = new CommandMapping();
    
    // Add a couple commands with mixed casing
    mapper.addCommand('Jump', () => {}, { description: 'J' });
    mapper.addCommand('Spin', () => {}, { description: 'S' });
    
    const names = mapper.getAllCommands();
    // Sort them so the order doesn't matter in our test
    expect(names.sort()).toEqual(['jump', 'spin']); // all lowercase
  });

  it('clearAllCommands empties the library', () => {
    const mapper = new CommandMapping();
    
    // Add two commands
    mapper.addCommand('A', () => {}, { description: '' });
    mapper.addCommand('B', () => {}, { description: '' });
    
    const lib = CommandLibrary.getInstance();
    expect(lib.list().length).toBe(2); // yep, both are there
    
    // Nuke everything
    mapper.clearAllCommands();
    expect(lib.list().length).toBe(0); // all gone!
  });

  it('normalizes and still works with whitespace', () => {
    const mapper = new CommandMapping();
    
    // Add a command with spaces around it - should still work
    const ok = mapper.addCommand(' TaP ', () => {}, { description: 'tap' });
    
    expect(ok).toBe(true);
    expect(mapper.hasCommand('tap')).toBe(true); // finds it without the spaces
  });

  it('rejects empty name after trim', () => {
    const mapper = new CommandMapping();
    
    // Try adding a command that's just whitespace - should fail
    const ok = mapper.addCommand('   ', () => {}, { description: '' });
    
    expect(ok).toBe(false); // nope!
    
    const lib = CommandLibrary.getInstance();
    expect(lib.list().length).toBe(0); // nothing got added
  });

  it('stored action executes when called from library', () => {
    const mapper = new CommandMapping();
    let executed = false;
    
    // Add a command that flips a flag when executed
    mapper.addCommand('fire', () => { executed = true; }, { description: 'shoot' });
    
    // Grab it from the library and execute it
    const lib = CommandLibrary.getInstance();
    const cmd = lib.get('fire');
    
    expect(cmd).toBeDefined();
    cmd?.action(); // run the action
    
    expect(executed).toBe(true); // should've flipped the flag
  });
});
