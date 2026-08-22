export type PredictionApiResponse = {
  company: string;
  direction: "UP" | "DOWN";
  up_pct: number;
  down_pct: number;
  confidence: number;
  lstm_pct: number;
  cnn_pct: number;
  lstm_weight: number;
  cnn_weight: number;
  as_of: string;
};

export type PredictionResult = PredictionApiResponse & {
  targetDate: string;
  isDemo: boolean;
  isMultiStep: boolean;
  stepsAhead: number;
  offline: boolean;
};

/** Confidence multiplier applied per iterative step beyond the first. */
const MULTI_STEP_DECAY = 0.85;

function nextTradingDate(from: Date): Date {
  const d = new Date(from);
  d.setDate(d.getDate() + 1);
  // Skip weekends — CSE trades Monday-Friday.
  while (d.getDay() === 0 || d.getDay() === 6) {
    d.setDate(d.getDate() + 1);
  }
  return d;
}

export function nextTradingDayISO(): string {
  return nextTradingDate(new Date()).toISOString().slice(0, 10);
}

/** Number of trading-day steps between the next trading day and targetDate (inclusive), minimum 1. */
export function countTradingSteps(targetDate: string): number {
  const target = new Date(`${targetDate}T00:00:00Z`);
  let cursor = nextTradingDate(new Date());
  let steps = 1;
  while (cursor.toISOString().slice(0, 10) < target.toISOString().slice(0, 10) && steps < 60) {
    cursor = nextTradingDate(cursor);
    steps += 1;
  }
  return steps;
}

/** Deterministic pseudo-random unit float in [0,1) seeded by a string. */
function seededUnit(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  // xorshift-ish mixing for a better spread than raw hash
  hash ^= hash << 13;
  hash ^= hash >>> 17;
  hash ^= hash << 5;
  return (Math.abs(hash) % 100000) / 100000;
}

export function buildDemoPrediction(ticker: string, targetDate: string): PredictionApiResponse {
  const seed = `${ticker}:${targetDate}`;
  const upProb = 35 + seededUnit(seed) * 40; // land somewhere in 35-75%
  const downProb = 100 - upProb;
  const direction: "UP" | "DOWN" = upProb >= 50 ? "UP" : "DOWN";
  const lstmPct = 40 + seededUnit(`${seed}:lstm`) * 40;
  const cnnPct = 40 + seededUnit(`${seed}:cnn`) * 40;
  const lstmWeight = 55 + seededUnit(`${seed}:w`) * 15;
  const cnnWeight = 100 - lstmWeight;
  const confidence = Math.abs(upProb - downProb);

  return {
    company: ticker,
    direction,
    up_pct: Number(upProb.toFixed(1)),
    down_pct: Number(downProb.toFixed(1)),
    confidence: Number(confidence.toFixed(1)),
    lstm_pct: Number(lstmPct.toFixed(1)),
    cnn_pct: Number(cnnPct.toFixed(1)),
    lstm_weight: Number(lstmWeight.toFixed(0)),
    cnn_weight: Number(cnnWeight.toFixed(0)),
    as_of: targetDate,
  };
}

/**
 * The live Flask API only predicts the immediate next trading day. For dates
 * further out, we simplify by post-processing that single-step response here
 * in Next.js: iteratively re-derive a synthetic next-step probability from
 * the previous step's direction/confidence, and discount confidence by
 * MULTI_STEP_DECAY per additional step. This is NOT the model looping on its
 * own inputs (that would require re-invoking the notebook's feature
 * pipeline) — it's an explicit, labeled approximation for the UI's "future
 * date" path, per the spec's simplification allowance.
 */
export function projectMultiStep(
  base: PredictionApiResponse,
  targetDate: string,
  steps: number
): PredictionResult {
  if (steps <= 1) {
    return {
      ...base,
      as_of: targetDate,
      targetDate,
      isDemo: false,
      isMultiStep: false,
      stepsAhead: 1,
      offline: false,
    };
  }

  let upPct = base.up_pct;
  let downPct = base.down_pct;

  for (let i = 1; i < steps; i++) {
    // Nudge the split gently toward 50/50 each extra step (regression to the
    // mean as the forecast horizon grows) while keeping the same direction.
    upPct = 50 + (upPct - 50) * MULTI_STEP_DECAY;
    downPct = 100 - upPct;
  }

  const direction: "UP" | "DOWN" = upPct >= 50 ? "UP" : "DOWN";
  const decayedConfidence = base.confidence * Math.pow(MULTI_STEP_DECAY, steps - 1);

  return {
    ...base,
    direction,
    up_pct: Number(upPct.toFixed(1)),
    down_pct: Number(downPct.toFixed(1)),
    confidence: Number(decayedConfidence.toFixed(1)),
    as_of: targetDate,
    targetDate,
    isDemo: false,
    isMultiStep: true,
    stepsAhead: steps,
    offline: false,
  };
}
