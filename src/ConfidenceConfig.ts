export interface ConfidenceConfig {
  /**
   * Global confidence threshold (0-1)
   * Commands will trigger if similarityScore >= globalThreshold
   * Default: .8 (80% match)
   */
  globalThreshold: number;

  /**
   * Whether to use phonetic matching or not
   * If false, will only use exact matching
   * Default: true
   */
  usePhoneticMatching: boolean;

  /**
   * Whether to log confidence scores
   */
  logConfidenceScore: boolean;
}

export const DEFAULT_CONFIDENCE_CONFIG: ConfidenceConfig = {
  globalThreshold: 0.8,
  usePhoneticMatching: true,
  logConfidenceScore: false,
};