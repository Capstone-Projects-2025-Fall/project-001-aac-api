import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Logger } from '../src/Logging';

describe('Logger', () => {
  let logger: Logger;

  beforeEach(() => {
    vi.useFakeTimers();
    logger = Logger.getInstance();
  });

  afterEach(() => {
    logger.clear();
    vi.useRealTimers();
  });

  describe('Sequential ID generation', () => {
    it('should generate sequential numeric IDs starting from 1', () => {
      const id1 = logger.createEntry('first transcription');
      const id2 = logger.createEntry('second transcription');
      const id3 = logger.createEntry('third transcription');

      expect(id1).toBe(1);
      expect(id2).toBe(2);
      expect(id3).toBe(3);
    });

    it('should reset ID counter after clear()', () => {
      logger.createEntry('first');
      logger.createEntry('second');
      
      logger.clear();
      
      const newId = logger.createEntry('after clear');
      expect(newId).toBe(1);
    });
  });

  describe('Pending entry lifecycle', () => {
    it('should create a pending entry', () => {
      const entryId = logger.createEntry('test transcription');
      
      expect(entryId).toBe(1);
      expect(logger.getTotalCount()).toBe(1);
      expect(logger.getPendingCount()).toBe(1);
      expect(logger.getFinalizedCount()).toBe(0);
    });

    it('should add matches to pending entry', () => {
      const entryId = logger.createEntry('jump forward');
      
      logger.addMatch(entryId, {
        commandName: 'jump',
        matchedWord: 'jump',
        synonymSource: 'direct',
        confidence: 1.0,
        status: 'success'
      });

      logger.addMatch(entryId, {
        commandName: 'forward',
        matchedWord: 'forward',
        synonymSource: 'direct',
        confidence: 1.0,
        status: 'success'
      });

      logger.finalizeEntry(entryId);

      const logs = logger.getAllLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].matchedCommands).toHaveLength(2);
    });

    it('should finalize entry and prevent further modifications', () => {
      const entryId = logger.createEntry('test');
      
      logger.addMatch(entryId, {
        commandName: 'test1',
        matchedWord: 'test',
        synonymSource: 'direct',
        confidence: 1.0,
        status: 'success'
      });

      logger.finalizeEntry(entryId);

      // Try to add another match after finalization
      logger.addMatch(entryId, {
        commandName: 'test2',
        matchedWord: 'test',
        synonymSource: 'direct',
        confidence: 1.0,
        status: 'success'
      });

      const logs = logger.getAllLogs();
      expect(logs[0].matchedCommands).toHaveLength(1);
      expect(logs[0].matchedCommands[0].commandName).toBe('test1');
    });

    it('should move entry from pending to finalized', () => {
      const entryId = logger.createEntry('test');
      
      expect(logger.getPendingCount()).toBe(1);
      expect(logger.getFinalizedCount()).toBe(0);

      logger.finalizeEntry(entryId);

      expect(logger.getPendingCount()).toBe(0);
      expect(logger.getFinalizedCount()).toBe(1);
    });
  });

  describe('Auto-finalization', () => {
    it('should auto-finalize entry after 60 seconds', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      logger.createEntry('test transcription');
      
      expect(logger.getPendingCount()).toBe(1);
      expect(logger.getFinalizedCount()).toBe(0);

      // Advance time by 60 seconds
      vi.advanceTimersByTime(60000);

      expect(logger.getPendingCount()).toBe(0);
      expect(logger.getFinalizedCount()).toBe(1);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Entry 1 was auto-finalized after 60 seconds')
      );

      consoleWarnSpy.mockRestore();
    });

    it('should log warning with transcription snippet on auto-finalization', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      logger.createEntry('This is a long transcription that should be truncated');
      
      vi.advanceTimersByTime(60000);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('This is a long transcription that should be tru')
      );

      consoleWarnSpy.mockRestore();
    });

    it('should not auto-finalize if manually finalized before timeout', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const entryId = logger.createEntry('test');
      logger.finalizeEntry(entryId);

      // Advance time by 60 seconds
      vi.advanceTimersByTime(60000);

      // Should not have warned because it was manually finalized
      expect(consoleWarnSpy).not.toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });
  });

  describe('getAllLogs - finalized entries only', () => {
    it('should return only finalized entries', () => {
      const id1 = logger.createEntry('finalized 1');
      logger.finalizeEntry(id1);

      logger.createEntry('pending');

      const id3 = logger.createEntry('finalized 2');
      logger.finalizeEntry(id3);

      const logs = logger.getAllLogs();
      expect(logs).toHaveLength(2);
      expect(logs[0].id).toBe(1);
      expect(logs[1].id).toBe(3);
    });

    it('should return empty array when no finalized entries', () => {
      logger.createEntry('pending 1');
      logger.createEntry('pending 2');

      const logs = logger.getAllLogs();
      expect(logs).toHaveLength(0);
    });

    it('should return entries sorted by ID', () => {
      const id1 = logger.createEntry('first');
      const id2 = logger.createEntry('second');
      const id3 = logger.createEntry('third');

      // Finalize in reverse order
      logger.finalizeEntry(id3);
      logger.finalizeEntry(id1);
      logger.finalizeEntry(id2);

      const logs = logger.getAllLogs();
      expect(logs[0].id).toBe(1);
      expect(logs[1].id).toBe(2);
      expect(logs[2].id).toBe(3);
    });
  });

  describe('JSON export', () => {
    it('should export logs as valid JSON string', () => {
      const entryId = logger.createEntry('test transcription');
      logger.addMatch(entryId, {
        commandName: 'jump',
        matchedWord: 'jump',
        synonymSource: 'direct',
        confidence: 1.0,
        status: 'success'
      });
      logger.finalizeEntry(entryId);

      const json = logger.exportToJSON();
      
      // Should be valid JSON
      expect(() => JSON.parse(json)).not.toThrow();
      
      const parsed = JSON.parse(json);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed).toHaveLength(1);
    });

    it('should include ISO 8601 timestamps in export', () => {
      const entryId = logger.createEntry('test');
      logger.finalizeEntry(entryId);

      const json = logger.exportToJSON();
      const parsed = JSON.parse(json);

      // Check ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)
      expect(parsed[0].timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it('should use 2-space indentation for readability', () => {
      const entryId = logger.createEntry('test');
      logger.finalizeEntry(entryId);

      const json = logger.exportToJSON();
      
      // Check for 2-space indentation (JSON.stringify with 2 spaces creates nested indentation)
      expect(json).toContain('\n  ');
      // Nested objects will have 4 spaces, which is expected with 2-space indentation
      const lines = json.split('\n');
      expect(lines[1]).toMatch(/^ {2}/); // First nested level: 2 spaces
    });
  });

  describe('Match source types', () => {
    it('should track direct match source', () => {
      const entryId = logger.createEntry('test');
      logger.addMatch(entryId, {
        commandName: 'jump',
        matchedWord: 'jump',
        synonymSource: 'direct',
        confidence: 1.0,
        status: 'success'
      });
      logger.finalizeEntry(entryId);

      const logs = logger.getAllLogs();
      expect(logs[0].matchedCommands[0].synonymSource).toBe('direct');
    });

    it('should track library-synonym match source', () => {
      const entryId = logger.createEntry('test');
      logger.addMatch(entryId, {
        commandName: 'jump',
        matchedWord: 'leap',
        matchedSynonym: 'leap',
        synonymSource: 'library-synonym',
        confidence: 1.0,
        status: 'success'
      });
      logger.finalizeEntry(entryId);

      const logs = logger.getAllLogs();
      const match = logs[0].matchedCommands[0];
      expect(match.synonymSource).toBe('library-synonym');
      expect(match.matchedSynonym).toBe('leap');
    });

    it('should track api-synonym match source', () => {
      const entryId = logger.createEntry('test');
      logger.addMatch(entryId, {
        commandName: 'jump',
        matchedWord: 'bound',
        matchedSynonym: 'bound',
        synonymSource: 'api-synonym',
        confidence: 1.0,
        status: 'success'
      });
      logger.finalizeEntry(entryId);

      const logs = logger.getAllLogs();
      const match = logs[0].matchedCommands[0];
      expect(match.synonymSource).toBe('api-synonym');
      expect(match.matchedSynonym).toBe('bound');
    });

    it('should track phonetic match source', () => {
      const entryId = logger.createEntry('test');
      logger.addMatch(entryId, {
        commandName: 'jump',
        matchedWord: 'jamp',
        synonymSource: 'phonetic',
        confidence: 0.85,
        status: 'success'
      });
      logger.finalizeEntry(entryId);

      const logs = logger.getAllLogs();
      const match = logs[0].matchedCommands[0];
      expect(match.synonymSource).toBe('phonetic');
      expect(match.confidence).toBe(0.85);
    });
  });

  describe('Error capture', () => {
    it('should capture error messages for failed commands', () => {
      const entryId = logger.createEntry('test');
      logger.addMatch(entryId, {
        commandName: 'broken',
        matchedWord: 'broken',
        synonymSource: 'direct',
        confidence: 1.0,
        status: 'failed',
        error: 'Command callback threw an error'
      });
      logger.finalizeEntry(entryId);

      const logs = logger.getAllLogs();
      const match = logs[0].matchedCommands[0];
      expect(match.status).toBe('failed');
      expect(match.error).toBe('Command callback threw an error');
    });

    it('should not include error field for successful commands', () => {
      const entryId = logger.createEntry('test');
      logger.addMatch(entryId, {
        commandName: 'working',
        matchedWord: 'working',
        synonymSource: 'direct',
        confidence: 1.0,
        status: 'success'
      });
      logger.finalizeEntry(entryId);

      const logs = logger.getAllLogs();
      const match = logs[0].matchedCommands[0];
      expect(match.status).toBe('success');
      expect(match.error).toBeUndefined();
    });
  });

  describe('Speaker ID support', () => {
    it('should record speaker ID when provided', () => {
      const entryId = logger.createEntry('hello world', 'speaker-1');
      logger.finalizeEntry(entryId);

      const logs = logger.getAllLogs();
      expect(logs[0].speakerId).toBe('speaker-1');
    });

    it('should handle entries without speaker ID', () => {
      const entryId = logger.createEntry('hello world');
      logger.finalizeEntry(entryId);

      const logs = logger.getAllLogs();
      expect(logs[0].speakerId).toBeUndefined();
    });

    it('should support multiple speakers in same session', () => {
      const id1 = logger.createEntry('speaker one text', 'speaker-1');
      logger.finalizeEntry(id1);

      const id2 = logger.createEntry('speaker two text', 'speaker-2');
      logger.finalizeEntry(id2);

      const id3 = logger.createEntry('single speaker text');
      logger.finalizeEntry(id3);

      const logs = logger.getAllLogs();
      expect(logs[0].speakerId).toBe('speaker-1');
      expect(logs[1].speakerId).toBe('speaker-2');
      expect(logs[2].speakerId).toBeUndefined();
    });
  });

  describe('Batch pruning', () => {
    it('should batch-prune oldest entries when maxLogSize exceeded', () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      // Configure with small max size
      logger.updateConfig({ maxLogSize: 5, pruneCount: 3 });

      // Create and finalize 8 entries
      for (let i = 1; i <= 8; i++) {
        const entryId = logger.createEntry(`transcription ${i}`);
        logger.finalizeEntry(entryId);
      }

      // Should have pruned 3 oldest entries (1, 2, 3)
      const logs = logger.getAllLogs();
      expect(logs).toHaveLength(5);
      expect(logs[0].id).toBe(4);
      expect(logs[4].id).toBe(8);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Pruned 3 oldest entries')
      );

      consoleLogSpy.mockRestore();
    });

    it('should not prune when below maxLogSize', () => {
      logger.updateConfig({ maxLogSize: 10, pruneCount: 3 });

      // Create 5 entries (below limit)
      for (let i = 1; i <= 5; i++) {
        const entryId = logger.createEntry(`transcription ${i}`);
        logger.finalizeEntry(entryId);
      }

      const logs = logger.getAllLogs();
      expect(logs).toHaveLength(5);
      expect(logs[0].id).toBe(1); // Oldest entry still exists
    });

    it('should not count pending entries toward maxLogSize', () => {
      logger.updateConfig({ maxLogSize: 3, pruneCount: 2 });

      // Create 3 finalized + 2 pending
      for (let i = 1; i <= 3; i++) {
        const entryId = logger.createEntry(`finalized ${i}`);
        logger.finalizeEntry(entryId);
      }

      logger.createEntry('pending 1');
      logger.createEntry('pending 2');

      // Should not have pruned yet
      const logs = logger.getAllLogs();
      expect(logs).toHaveLength(3);
      expect(logs[0].id).toBe(1);
    });
  });

  describe('clear() method', () => {
    it('should clear all entries and reset ID counter', () => {
      const id1 = logger.createEntry('test 1');
      logger.finalizeEntry(id1);
      logger.createEntry('test 2');

      logger.clear();

      expect(logger.getTotalCount()).toBe(0);
      expect(logger.getPendingCount()).toBe(0);
      expect(logger.getFinalizedCount()).toBe(0);

      const newId = logger.createEntry('after clear');
      expect(newId).toBe(1);
    });

    it('should cancel all pending auto-finalization timeouts', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      logger.createEntry('pending 1');
      logger.createEntry('pending 2');
      logger.createEntry('pending 3');

      logger.clear();

      // Advance time - should not trigger auto-finalization warnings
      vi.advanceTimersByTime(60000);

      expect(consoleWarnSpy).not.toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });
  });

  describe('getJSONBlob()', () => {
    it('should return plain object array suitable for manual serialization', () => {
      const entryId = logger.createEntry('test');
      logger.addMatch(entryId, {
        commandName: 'test',
        matchedWord: 'test',
        synonymSource: 'direct',
        confidence: 1.0,
        status: 'success'
      });
      logger.finalizeEntry(entryId);

      const blob = logger.getJSONBlob();

      expect(Array.isArray(blob)).toBe(true);
      expect(blob).toHaveLength(1);
      expect(blob[0].transcriptionText).toBe('test');
      expect(blob[0].matchedCommands).toHaveLength(1);
    });
  });

  describe('Log entry immutability', () => {
    it('should return immutable copies from getAllLogs', () => {
      const entryId = logger.createEntry('original text');
      logger.addMatch(entryId, {
        commandName: 'test',
        matchedWord: 'test',
        synonymSource: 'direct',
        confidence: 1.0,
        status: 'success'
      });
      logger.finalizeEntry(entryId);

      const logs1 = logger.getAllLogs();
      const logs2 = logger.getAllLogs();

      // Should be different instances
      expect(logs1).not.toBe(logs2);
      expect(logs1[0]).not.toBe(logs2[0]);
      expect(logs1[0].matchedCommands).not.toBe(logs2[0].matchedCommands);

      // But have same values
      expect(logs1[0].id).toBe(logs2[0].id);
      expect(logs1[0].transcriptionText).toBe(logs2[0].transcriptionText);
    });
  });

  describe('Edge cases', () => {
    it('should handle adding match to non-existent entry', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      logger.addMatch(999, {
        commandName: 'test',
        matchedWord: 'test',
        synonymSource: 'direct',
        confidence: 1.0,
        status: 'success'
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Cannot add match to non-existent entry 999')
      );

      consoleWarnSpy.mockRestore();
    });

    it('should handle finalizing non-existent entry', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      logger.finalizeEntry(999);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Cannot finalize non-existent entry 999')
      );

      consoleWarnSpy.mockRestore();
    });

    it('should handle finalizing already finalized entry', () => {
      const entryId = logger.createEntry('test');
      logger.finalizeEntry(entryId);
      
      // Finalize again - should not error
      logger.finalizeEntry(entryId);

      const logs = logger.getAllLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].finalized).toBe(true);
    });
  });
});
