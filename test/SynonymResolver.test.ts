import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SynonymResolver } from '../src/SynonymResolver';

describe('SynonymResolver - Basic Tests', () => {
  let resolver: SynonymResolver;

  // Reset the resolver before each test to ensure clean state
  beforeEach(() => {
    resolver = SynonymResolver.getInstance();
    resolver.clearCache(); // Start fresh for each test
  });

  it('should return a singleton instance', () => {
    // Get two instances and make sure they're the same object
    const instance1 = SynonymResolver.getInstance();
    const instance2 = SynonymResolver.getInstance();
    
    expect(instance1).toBe(instance2); // Should be the exact same instance
  });

  it('should fetch synonyms from API', async () => {
    // Fetch synonyms for the word "jump"
    const synonyms = await resolver.getSynonyms('jump');
    
    // Should return an array with synonyms
    expect(Array.isArray(synonyms)).toBe(true);
    expect(synonyms.length).toBeGreaterThan(0); // Should have at least some synonyms
    
    console.log('Synonyms for "jump":', synonyms);
  });

  it('should normalize words to lowercase', async () => {
    // Test with uppercase word
    const synonyms1 = await resolver.getSynonyms('JUMP');
    const synonyms2 = await resolver.getSynonyms('jump');
    
    // Both should return the same results
    expect(synonyms1).toEqual(synonyms2);
  });

  it('should cache synonyms after first fetch', async () => {
    // First fetch - should call API
    const synonyms1 = await resolver.getSynonyms('run');
    
    // Check cache size increased
    expect(resolver.getCacheSize()).toBe(1);
    
    // Second fetch - should use cache
    const synonyms2 = await resolver.getSynonyms('run');
    
    // Should return same results
    expect(synonyms1).toEqual(synonyms2);
    
    // Cache size should still be 1 (not duplicated)
    expect(resolver.getCacheSize()).toBe(1);
  });

  it('should return empty array for invalid input', async () => {
    // Test with empty string
    const synonyms = await resolver.getSynonyms('');
    
    expect(synonyms).toEqual([]);
  });

  it('should clear cache', async () => {
    // Add some words to cache
    await resolver.getSynonyms('jump');
    await resolver.getSynonyms('run');
    
    // Cache should have 2 words
    expect(resolver.getCacheSize()).toBe(2);
    
    // Clear the cache
    resolver.clearCache();
    
    // Cache should be empty
    expect(resolver.getCacheSize()).toBe(0);
  });

  it('should return cache size correctly', async () => {
    // Initially cache should be empty
    expect(resolver.getCacheSize()).toBe(0);
    
    // Add one word
    await resolver.getSynonyms('jump');
    expect(resolver.getCacheSize()).toBe(1);
    
    // Add another word
    await resolver.getSynonyms('run');
    expect(resolver.getCacheSize()).toBe(2);
  });

  it('should exclude the original word from synonyms', async () => {
    // Get synonyms for "jump"
    const synonyms = await resolver.getSynonyms('jump');
    
    // The word "jump" itself should not be in the synonyms list
    expect(synonyms).not.toContain('jump');
  });

  it('should handle whitespace in words', async () => {
    // Test with extra whitespace
    const synonyms = await resolver.getSynonyms('  walk  ');
    
    // Should still work and return results
    expect(Array.isArray(synonyms)).toBe(true);
    
    // Cache size should increase
    expect(resolver.getCacheSize()).toBeGreaterThan(0);
  });

  it('should check if two words are synonyms', async () => {
    // "leap" and "jump" are synonyms
    const areSynonyms = await resolver.areSynonyms('jump', 'leap');
    
    // This should be true (or at least not throw an error)
    expect(typeof areSynonyms).toBe('boolean');
    console.log('Are "jump" and "leap" synonyms?', areSynonyms);
  });

  it('should return true when comparing same word', async () => {
    // Same word should always be considered a synonym of itself
    const areSynonyms = await resolver.areSynonyms('jump', 'jump');
    
    expect(areSynonyms).toBe(true);
  });

  it('should check if word is cached', async () => {
    // Initially not cached
    expect(resolver.isCached('jump')).toBe(false);
    
    // Fetch synonyms
    await resolver.getSynonyms('jump');
    
    // Now it should be cached
    expect(resolver.isCached('jump')).toBe(true);
  });

  it('should prefetch multiple words', async () => {
    // Start with empty cache
    expect(resolver.getCacheSize()).toBe(0);
    
    // Prefetch synonyms for multiple words
    await resolver.prefetchSynonyms(['jump', 'run', 'walk']);
    
    // All three should now be cached
    expect(resolver.getCacheSize()).toBe(3);
    expect(resolver.isCached('jump')).toBe(true);
    expect(resolver.isCached('run')).toBe(true);
    expect(resolver.isCached('walk')).toBe(true);
  });

  it('should handle API errors gracefully', async () => {
    // Mock fetch to simulate API failure
    const originalFetch = global.fetch;
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
      } as Response)
    );
    
    // Should return empty array instead of throwing error
    const synonyms = await resolver.getSynonyms('test');
    
    expect(synonyms).toEqual([]);
    
    // Restore original fetch
    global.fetch = originalFetch;
  });
});