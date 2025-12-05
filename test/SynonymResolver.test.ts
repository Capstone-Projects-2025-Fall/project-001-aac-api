import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { SynonymResolver } from '../src/SynonymResolver';

describe('SynonymResolver', () => {
  let resolver: SynonymResolver;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Mock the global fetch function
    fetchMock = vi.fn();
    global.fetch = fetchMock;

    // Get fresh resolver and clear cache
    resolver = SynonymResolver.getInstance();
    resolver.clearCache();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Helper to mock successful API response
  const mockApiSuccess = (synonyms: string[]) => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => synonyms.map(word => ({ word, score: 1000 })),
    } as Response);
  };

  // Helper to mock failed API response
  const mockApiFailure = (status = 500) => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status,
    } as Response);
  };

  it('should return a singleton instance', () => {
    const instance1 = SynonymResolver.getInstance();
    const instance2 = SynonymResolver.getInstance();
    expect(instance1).toBe(instance2);
  });

  it('should fetch synonyms from API', async () => {
    mockApiSuccess(['leap', 'hop', 'spring', 'bound']);
    
    const synonyms = await resolver.getSynonyms('jump');
    
    expect(synonyms).toEqual(['leap', 'hop', 'spring', 'bound']);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('should normalize words to lowercase', async () => {
    mockApiSuccess(['leap', 'hop']);
    
    const synonyms = await resolver.getSynonyms('JUMP');
    
    expect(synonyms).toEqual(['leap', 'hop']);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('ml=jump')
    );
  });

  it('should cache synonyms after first fetch', async () => {
    mockApiSuccess(['jog', 'sprint']);
    
    await resolver.getSynonyms('run');
    await resolver.getSynonyms('run'); // Second call should use cache
    
    expect(resolver.getCacheSize()).toBe(1);
    expect(fetchMock).toHaveBeenCalledTimes(1); // Only called once
  });

  it('should return empty array for invalid input', async () => {
    const synonyms = await resolver.getSynonyms('');
    
    expect(synonyms).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('should clear cache', async () => {
    mockApiSuccess(['leap', 'hop']);
    await resolver.getSynonyms('jump');
    
    expect(resolver.getCacheSize()).toBe(1);
    
    resolver.clearCache();
    
    expect(resolver.getCacheSize()).toBe(0);
  });

  it('should exclude the original word from synonyms', async () => {
    mockApiSuccess(['jump', 'leap', 'hop']);
    
    const synonyms = await resolver.getSynonyms('jump');
    
    expect(synonyms).not.toContain('jump');
    expect(synonyms).toEqual(['leap', 'hop']);
  });

  it('should handle whitespace in words', async () => {
    mockApiSuccess(['stroll', 'stride']);
    
    const synonyms = await resolver.getSynonyms('  walk  ');
    
    expect(synonyms).toEqual(['stroll', 'stride']);
    expect(resolver.getCacheSize()).toBe(1);
  });

  it('should check if two words are synonyms', async () => {
    mockApiSuccess(['leap', 'hop', 'spring']);
    
    const result = await resolver.areSynonyms('jump', 'leap');
    
    expect(result).toBe(true);
  });

  it('should return false when words are not synonyms', async () => {
    mockApiSuccess(['leap', 'hop']);
    
    const result = await resolver.areSynonyms('jump', 'run');
    
    expect(result).toBe(false);
  });

  it('should return true when comparing same word', async () => {
    const result = await resolver.areSynonyms('jump', 'jump');
    
    expect(result).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('should check if word is cached', async () => {
    expect(resolver.isCached('jump')).toBe(false);
    
    mockApiSuccess(['leap', 'hop']);
    await resolver.getSynonyms('jump');
    
    expect(resolver.isCached('jump')).toBe(true);
  });

  it('should prefetch multiple words', async () => {
    mockApiSuccess(['leap', 'hop']);
    mockApiSuccess(['jog', 'sprint']);
    mockApiSuccess(['stroll', 'stride']);
    
    await resolver.prefetchSynonyms(['jump', 'run', 'walk']);
    
    expect(resolver.getCacheSize()).toBe(3);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('should handle API errors gracefully', async () => {
    mockApiFailure(500);
    
    const synonyms = await resolver.getSynonyms('test');
    
    expect(synonyms).toEqual([]);
    expect(resolver.isCached('test')).toBe(true);
  });

  it('should handle network errors gracefully', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Network error'));
    
    const synonyms = await resolver.getSynonyms('test');
    
    expect(synonyms).toEqual([]);
  });

  it('should handle empty API response', async () => {
    mockApiSuccess([]);
    
    const synonyms = await resolver.getSynonyms('xyz123');
    
    expect(synonyms).toEqual([]);
    expect(resolver.isCached('xyz123')).toBe(true);
  });

  it('should call API with correct URL parameters', async () => {
    mockApiSuccess(['leap', 'hop']);
    const max = resolver.getMax_Results();
    await resolver.getSynonyms('jump');
    
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('ml=jump'));
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining(`max=${max}`));
  });
});
