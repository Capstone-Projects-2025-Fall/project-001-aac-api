/**
 * SynonymResolver provides synonym matching capabilities using the DataMuse API.
 * 
 * This is the basic version that includes:
 * - Singleton pattern
 * - Basic synonym fetching from DataMuse API
 * - Simple in-memory caching
 * - Error handling
 * 
 * @example
 * ```ts
 * const resolver = SynonymResolver.getInstance();
 * const synonyms = await resolver.getSynonyms('jump');
 * // Returns: ['leap', 'hop', 'spring', 'bound', ...]
 * ```
 */
export class SynonymResolver {
  /** Cache to store synonym results and avoid repeated API calls */
  private synonymCache: Map<string, string[]>;

  /** The single global instance of SynonymResolver */
  private static instance: SynonymResolver;

  /** Base URL for the DataMuse API */
  private readonly API_URL = 'https://api.datamuse.com/words';

  /** Maximum number of synonyms to fetch per word */
  private readonly MAX_RESULTS = 20;

  /** Private constructor prevents direct instantiation - use getInstance() */
  private constructor() {
    this.synonymCache = new Map<string, string[]>();
  }

  /**
   * Returns the singleton instance of SynonymResolver.
   * 
   * @returns {SynonymResolver} The single shared instance
   */
  public static getInstance(): SynonymResolver {
    if (!SynonymResolver.instance) {
      SynonymResolver.instance = new SynonymResolver();
    }
    return SynonymResolver.instance;
  }

  /**
   * Fetches synonyms for a given word from the DataMuse API.
   * Results are cached in memory to avoid repeated API calls for the same word.
   * 
   * The DataMuse API parameter 'ml' means "means like" which returns synonyms.
   * API is free and doesn't require authentication.
   * 
   * @param {string} word - The word to find synonyms for
   * @returns {Promise<string[]>} Array of synonym words (lowercase), empty array on error
   * 
   * @example
   * ```ts
   * const resolver = SynonymResolver.getInstance();
   * const synonyms = await resolver.getSynonyms('jump');
   * console.log(synonyms); // ['leap', 'hop', 'spring', 'bound', ...]
   * ```
   */
  public async getSynonyms(word: string): Promise<string[]> {
    const normalized = word.toLowerCase().trim();

    // Return empty array for invalid input
    if (!normalized) {
      console.warn('Cannot fetch synonyms for empty word');
      return [];
    }

    // Check cache first to avoid unnecessary API calls
    if (this.synonymCache.has(normalized)) {
      console.log(`Cache hit for "${normalized}"`);
      return this.synonymCache.get(normalized)!;
    }

    try {
      // Build API URL with query parameters
      // ml= means "means like" (synonyms)
      // max= limits the number of results
      const url = `${this.API_URL}?ml=${encodeURIComponent(normalized)}&max=${this.MAX_RESULTS}`;
      
      console.log(`Fetching synonyms for "${normalized}" from DataMuse API...`);
      
      const response = await fetch(url);

      if (!response.ok) {
        console.warn(`DataMuse API returned status ${response.status} for "${word}"`);
        // Cache empty array to avoid repeated failed requests
        this.synonymCache.set(normalized, []);
        return [];
      }

      // Parse JSON response
      const data = await response.json();
      
      // DataMuse returns array of objects like: [{word: "leap", score: 1234}, ...]
      // Extract just the words and normalize to lowercase
      const synonyms = data
        .map((item: { word: string }) => item.word.toLowerCase().trim())
        .filter((synonym: string) => synonym !== normalized); // Exclude the original word

      console.log(`Found ${synonyms.length} synonyms for "${normalized}"`);

      // Cache the results for future use
      this.synonymCache.set(normalized, synonyms);

      return synonyms;
    } catch (error) {
      console.error(`Error fetching synonyms for "${word}":`, error);
      
      // Cache empty array to prevent repeated failures
      this.synonymCache.set(normalized, []);
      return [];
    }
  }

  /**
   * Clears the entire synonym cache.
   * Useful for testing or if you want to force fresh API calls.
   * 
   * @returns {void}
   */
  public clearCache(): void {
    this.synonymCache.clear();
    console.log('Synonym cache cleared');
  }

  /**
   * Returns the number of words currently cached.
   * 
   * @returns {number} Number of words in the cache
   */
  public getCacheSize(): number {
    return this.synonymCache.size;
  }
}