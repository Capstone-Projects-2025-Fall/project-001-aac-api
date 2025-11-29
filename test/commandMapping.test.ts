import { describe, it, expect, beforeEach, vi} from 'vitest';
import { CommandMapping, CommandAddResult } from '../src/commandMapping';
import { CommandLibrary } from '../src/commandLibrary';
import { SynonymResolver } from '../src/SynonymResolver';

describe('CommandMapping', () => {
  let mapper: CommandMapping;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Mock fetch
    fetchMock = vi.fn();
    global.fetch = fetchMock;

    // Clean slate before each test
    CommandLibrary.getInstance().clear();
    SynonymResolver.getInstance().clearCache();
    
    mapper = new CommandMapping();
  });

  // Helper to mock API response
  const mockSynonyms = (synonyms: string[]) => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => synonyms.map(word => ({ word, score: 1000 })),
    } as Response);
  };

  describe('Basic Command Operations', () => {
    it('adds a command and returns success result', async () => {
      const result = await mapper.addCommand('jump', () => {}, { 
        description: 'Make avatar jump', 
        active: true,
        fetchSynonyms: false
      });
      
      expect(result.success).toBe(true);
      expect(result.commandName).toBe('jump');
      expect(result.synonymsMapped).toEqual([]);
      expect(result.synonymCount).toBe(0);
      expect(mapper.hasCommand('jump')).toBe(true);
    });

    it('rejects duplicate commands', async () => {
      await mapper.addCommand('attack', () => {}, { fetchSynonyms: false });
      
      const result = await mapper.addCommand('attack', () => {}, { fetchSynonyms: false });
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('already exists');
      expect(result.synonymsMapped).toEqual([]);
    });

    it('rejects empty command name', async () => {
      const result = await mapper.addCommand('   ', () => {}, { fetchSynonyms: false });
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('cannot be empty');
    });

    it('removes a command', async () => {
      await mapper.addCommand('defend', () => {}, { fetchSynonyms: false });
      
      const removed = mapper.removeCommand('defend');
      
      expect(removed).toBe(true);
      expect(mapper.hasCommand('defend')).toBe(false);
    });

    it('lists all commands', async () => {
      await mapper.addCommand('jump', () => {}, { fetchSynonyms: false });
      await mapper.addCommand('run', () => {}, { fetchSynonyms: false });
      
      const commands = mapper.getAllCommands();
      
      expect(commands).toContain('jump');
      expect(commands).toContain('run');
      expect(commands.length).toBe(2);
    });

    it('clears all commands', async () => {
      await mapper.addCommand('jump', () => {}, { fetchSynonyms: false });
      await mapper.addCommand('run', () => {}, { fetchSynonyms: false });
      
      mapper.clearAllCommands();
      
      expect(mapper.getAllCommands().length).toBe(0);
    });
  });

  describe('Synonym Response (CommandAddResult)', () => {
    it('returns synonyms that were mapped', async () => {
      mockSynonyms(['leap', 'hop', 'spring', 'bound']);
      
      const result: CommandAddResult = await mapper.addCommand('jump', () => {}, {
        fetchSynonyms: true
      });
      
      expect(result.success).toBe(true);
      expect(result.commandName).toBe('jump');
      expect(result.synonymsMapped).toEqual(['leap', 'hop', 'spring', 'bound']);
      expect(result.synonymCount).toBe(4);
    });

    it('returns empty array when fetchSynonyms is false', async () => {
      const result = await mapper.addCommand('jump', () => {}, {
        fetchSynonyms: false
      });
      
      expect(result.success).toBe(true);
      expect(result.synonymsMapped).toEqual([]);
      expect(result.synonymCount).toBe(0);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('returns empty array when API returns no synonyms', async () => {
      mockSynonyms([]);
      
      const result = await mapper.addCommand('xyz123', () => {}, {
        fetchSynonyms: true
      });
      
      expect(result.success).toBe(true);
      expect(result.synonymsMapped).toEqual([]);
      expect(result.synonymCount).toBe(0);
    });

    it('handles API errors gracefully', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Network error'));
      
      const result = await mapper.addCommand('jump', () => {}, {
        fetchSynonyms: true
      });
      
      expect(result.success).toBe(true);
      expect(result.synonymsMapped).toEqual([]);
      expect(result.synonymCount).toBe(0);
    });
  });

  describe('getAllSynonymMappings', () => {
    it('returns empty map when no synonyms exist', async () => {
      await mapper.addCommand('jump', () => {}, { fetchSynonyms: false });
      
      const mappings = mapper.getAllSynonymMappings();
      
      expect(mappings.size).toBe(0);
    });

    it('returns map of commands to synonyms', async () => {
      mockSynonyms(['leap', 'hop']);
      await mapper.addCommand('jump', () => {}, { fetchSynonyms: true });
      
      mockSynonyms(['sprint', 'jog']);
      await mapper.addCommand('run', () => {}, { fetchSynonyms: true });
      
      const mappings = mapper.getAllSynonymMappings();
      
      expect(mappings.size).toBe(2);
      expect(mappings.get('jump')).toEqual(['leap', 'hop']);
      expect(mappings.get('run')).toEqual(['sprint', 'jog']);
    });

    it('works with manually added synonyms', async () => {
      await mapper.addCommand('jump', () => {}, { fetchSynonyms: false });
      mapper.addSynonym('leap', 'jump');
      mapper.addSynonym('hop', 'jump');
      
      const mappings = mapper.getAllSynonymMappings();
      
      expect(mappings.get('jump')).toContain('leap');
      expect(mappings.get('jump')).toContain('hop');
    });
  });

  describe('Manual Synonym Operations', () => {
    it('adds a single synonym manually', async () => {
      await mapper.addCommand('jump', () => {}, { fetchSynonyms: false });
      
      const added = mapper.addSynonym('leap', 'jump');
      
      expect(added).toBe(true);
      expect(mapper.getSynonymsForCommand('jump')).toContain('leap');
    });

    it('adds multiple synonyms manually', async () => {
      await mapper.addCommand('jump', () => {}, { fetchSynonyms: false });
      
      const count = mapper.addSynonyms(['leap', 'hop', 'spring'], 'jump');
      
      expect(count).toBe(3);
      const synonyms = mapper.getSynonymsForCommand('jump');
      expect(synonyms).toContain('leap');
      expect(synonyms).toContain('hop');
      expect(synonyms).toContain('spring');
    });

    it('gets synonyms for a specific command', async () => {
      await mapper.addCommand('jump', () => {}, { fetchSynonyms: false });
      mapper.addSynonym('leap', 'jump');
      mapper.addSynonym('hop', 'jump');
      
      const synonyms = mapper.getSynonymsForCommand('jump');
      
      expect(synonyms.length).toBe(2);
      expect(synonyms).toContain('leap');
      expect(synonyms).toContain('hop');
    });

    it('returns synonym count', async () => {
      await mapper.addCommand('jump', () => {}, { fetchSynonyms: false });
      mapper.addSynonym('leap', 'jump');
      mapper.addSynonym('hop', 'jump');
      
      expect(mapper.getSynonymCount()).toBe(2);
    });
  });
});
