/**
 * Display-only bucketing of the numeric confidence score (0-100) the API
 * returns. Purely presentational — never used to alter how confidence is
 * calculated or returned by /api/predict.
 */
export type ConfidenceBucket = "low" | "moderate" | "high";

export function getConfidenceBucket(confidence: number): ConfidenceBucket {
  if (confidence < 20) return "low";
  if (confidence < 60) return "moderate";
  return "high";
}
