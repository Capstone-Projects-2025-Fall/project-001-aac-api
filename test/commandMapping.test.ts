import { describe, it, expect, beforeEach } from 'vitest';
import { CommandMapping } from '../src/commandMapping';
import { CommandLibrary } from '../src/commandLibrary';

describe('CommandMapping <-> CommandLibrary integration', () => {
  // Clean slate before each test so we don't get weird carryover issues
  beforeEach(() => {
    CommandLibrary.getInstance().clear();
  });

  it('adds a command into the library and can retrieve it', async() => {
    const mapper = new CommandMapping();
    
    // Try adding a Jump command - should work fine
    const added = await mapper.addCommand('Jump', () => {/* no-op */}, { 
      description: 'Make avatar jump', 
      active: true ,
      fetchSynonyms: false

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

  it('rejects duplicates by name (case-insensitive)', async() => {
    const mapper = new CommandMapping();
    
    // Add "Attack" first
    const first = await mapper.addCommand('Attack', () => {}, { 
      description: 'Atk',
      fetchSynonyms: false
     });
    // Try adding "attack" again - should fail because it's the same command
    const second = await mapper.addCommand('attack', () => {}, { 
      description: 'Duplicate',
      fetchSynonyms: false
     });
    
    expect(first).toBe(true);
    expect(second).toBe(false); // nope, no duplicates allowed through this. 
    
    // Double check the library only has one command
    const lib = CommandLibrary.getInstance();
    const all = lib.list();
    expect(all.length).toBe(1);
    expect(all[0].name).toBe('attack'); // normalized
    expect(all[0].description).toBe('Atk'); // kept the original description
  });

  it('removes an existing command', async() => {
    const mapper = new CommandMapping();
    
    // Add a defend command
    await mapper.addCommand('Defend', () => {}, { 
      description: 'Block',
      fetchSynonyms: false
     });
    expect(mapper.hasCommand('defend')).toBe(true);
    
    // Remove it using uppercase (testing case-insensitivity)
    const removed = mapper.removeCommand('DEFEND');
    
    expect(removed).toBe(true);
    expect(mapper.hasCommand('defend')).toBe(false); // should be gone now
    
    // Make sure it's actually removed from the library too
    const lib = CommandLibrary.getInstance();
    expect(lib.get('defend')).toBeUndefined();
  });

  it('lists all commands (normalized names)', async() => {
    const mapper = new CommandMapping();
    
    // Add a couple commands with mixed casing
    await mapper.addCommand('Jump', () => {}, { 
      description: 'J',
      fetchSynonyms: false 
  });
    await mapper.addCommand('Spin', () => {}, { 
      description: 'S',
      fetchSynonyms: false 
     });
    
    const names = mapper.getAllCommands();
    // Sort them so the order doesn't matter in our test
    expect(names.sort()).toEqual(['jump', 'spin']); // all lowercase
  });

  it('clearAllCommands empties the library', async() => {
    const mapper = new CommandMapping();
    
    // Add two commands
    await mapper.addCommand('A', () => {}, { 
      description: '' ,
      fetchSynonyms: false 
    });
    await mapper.addCommand('B', () => {}, {
      description: '',
      fetchSynonyms: false 
     });
    
    const lib = CommandLibrary.getInstance();
    expect(lib.list().length).toBe(2); // yep, both are there
    
    // Nuke everything
    mapper.clearAllCommands();
    expect(lib.list().length).toBe(0); // all gone!
  });

  it('normalizes and still works with whitespace', async() => {
    const mapper = new CommandMapping();
    
    // Add a command with spaces around it - should still work
    const ok = await mapper.addCommand(' TaP ', () => {}, { 
      description: 'tap',
      fetchSynonyms: false 
     });

    
    expect(ok).toBe(true);
    expect(mapper.hasCommand('tap')).toBe(true); // finds it without the spaces
  });

  it('rejects empty name after trim', async() => {
    const mapper = new CommandMapping();
    
    // Try adding a command that's just whitespace - should fail
    const ok = await mapper.addCommand('   ', () => {}, { 
      description: '',
      fetchSynonyms: false 
     });
    
    expect(ok).toBe(false); // nope!
    
    const lib = CommandLibrary.getInstance();
    expect(lib.list().length).toBe(0); // nothing got added
  });

  it('stored action executes when called from library', async() => {
    const mapper = new CommandMapping();
    let executed = false;
    
    // Add a command that flips a flag when executed
    await mapper.addCommand('fire', () => { executed = true; }, { 
      description: 'shoot',
      fetchSynonyms: false 
     });
    
    // Grab it from the library and execute it
    const lib = CommandLibrary.getInstance();
    const cmd = lib.get('fire');
    
    expect(cmd).toBeDefined();
    cmd?.action(); // run the action
    
    expect(executed).toBe(true); // should've flipped the flag
  });
});
