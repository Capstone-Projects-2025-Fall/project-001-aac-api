import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ConfidenceMatcher } from '../src/ConfidenceMatcher';
import { CommandLibrary } from '../src/commandLibrary';

describe('ConfidenceMatcher', () => {
  let matcher: ConfidenceMatcher;
  let library: CommandLibrary;

  beforeEach(() => {
    matcher = new ConfidenceMatcher();
    library = CommandLibrary.getInstance();
    library.clear();
  });

  describe('constructor and config', () => {
    it('uses default config when none provided', () => {
      const m = new ConfidenceMatcher();
      expect(m.getGlobalThreshold()).toBe(0.8);
      expect(m.isPhoneticMatchingEnabled()).toBe(true);
    });

    it('accepts partial config override', () => {
      const m = new ConfidenceMatcher({ globalThreshold: 0.8 });
      expect(m.getGlobalThreshold()).toBe(0.8);
    });
  });

  describe('findMatch', () => {
    it('returns exact match when command exists and is active', () => {
      library.add({ name: 'jump', action: vi.fn(), description: 'Jump', active: true });

      const result = matcher.findMatch('jump', library);

      expect(result).not.toBeNull();
      expect(result?.command.name).toBe('jump');
      expect(result?.confidence).toBe(1.0);
      expect(result?.isExactMatch).toBe(true);
    });

    it('returns null when phonetic matching disabled and no exact match', () => {
      matcher.setPhoneticMatching(false);
      const result = matcher.findMatch('attack', library);
      expect(result).toBeNull();
    });

    it('finds phonetic match when exact match fails', () => {
      library.add({ name: 'attack', action: vi.fn(), description: 'Attack', active: true });
      matcher.setGlobalThreshold(0.5);

      const result = matcher.findMatch('attak', library);

      expect(result).not.toBeNull();
      expect(result?.command.name).toBe('attack');
      expect(result?.isExactMatch).toBe(false);
    });

    it('returns null when no commands meet threshold', () => {
      library.add({ name: 'attack', action: vi.fn(), description: 'Attack', active: true });
      matcher.setGlobalThreshold(0.99);

      const result = matcher.findMatch('xyz', library);
      expect(result).toBeNull();
    });
  });

  describe('threshold management', () => {
    it('sets and gets global threshold', () => {
      matcher.setGlobalThreshold(0.85);
      expect(matcher.getGlobalThreshold()).toBe(0.85);
    });

    it('throws error for invalid threshold', () => {
      expect(() => matcher.setGlobalThreshold(-0.1)).toThrow('Threshold must be between 0 and 1');
    });
  });

  describe('phonetic matching toggle', () => {
    it('can enable and disable phonetic matching', () => {
      matcher.setPhoneticMatching(false);
      expect(matcher.isPhoneticMatchingEnabled()).toBe(false);

      matcher.setPhoneticMatching(true);
      expect(matcher.isPhoneticMatchingEnabled()).toBe(true);
    });
  });
});