import { describe, it, expect, beforeEach } from 'vitest';
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
});