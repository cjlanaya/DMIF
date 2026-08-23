import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { insertPrediction } from "@/lib/db";
import { isKnownTicker } from "@/lib/chart-data";
import {
  buildDemoPrediction,
  countTradingSteps,
  NEXT_TRADING_DATE,
  projectMultiStep,
  type PredictionApiResponse,
} from "@/lib/predict";

const FETCH_TIMEOUT_MS = 8000;

async function fetchLivePrediction(
  baseUrl: string,
  ticker: string
): Promise<PredictionApiResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/predict/${ticker}`, {
      method: "GET",
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      throw new Error(`Prediction API responded with status ${res.status}`);
    }
    return (await res.json()) as PredictionApiResponse;
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const ticker = typeof body?.ticker === "string" ? body.ticker : "";
  const targetDate: string =
    typeof body?.targetDate === "string" && body.targetDate
      ? body.targetDate
      : NEXT_TRADING_DATE;

  if (!ticker || !isKnownTicker(ticker)) {
    return NextResponse.json({ error: "unknown_ticker" }, { status: 400 });
  }

  // The dataset ends at DATASET_LAST_TRADING_DATE — nothing before
  // NEXT_TRADING_DATE is a valid prediction target (it's already-known
  // history, not a forecast). The date picker also enforces this via its
  // `min` attribute, but the API validates independently of the client.
  if (targetDate < NEXT_TRADING_DATE) {
    return NextResponse.json({ error: "target_date_before_dataset_boundary" }, { status: 400 });
  }

  const demoMode = process.env.DEMO_MODE === "true";
  const baseUrl = process.env.PREDICTION_API_BASE_URL;
  const steps = countTradingSteps(targetDate);

  let base: PredictionApiResponse | null = null;
  let offline = false;
  let isDemo = false;

  if (demoMode) {
    base = buildDemoPrediction(ticker, targetDate);
    isDemo = true;
  } else if (baseUrl) {
    try {
      base = await fetchLivePrediction(baseUrl, ticker);
    } catch {
      offline = true;
    }
  } else {
    offline = true;
  }

  if (!base) {
    return NextResponse.json(
      {
        offline: true,
        error: "prediction_engine_offline",
      },
      { status: 503 }
    );
  }

  const result = projectMultiStep(base, targetDate, steps);
  result.isDemo = isDemo;
  result.offline = offline;

  await insertPrediction({
    userId: session.userId,
    ticker,
    targetDate,
    direction: result.direction,
    confidence: result.confidence,
    lstmPct: result.lstm_pct ?? null,
    cnnPct: result.cnn_pct ?? null,
    lstmWeight: result.lstm_weight ?? null,
    cnnWeight: result.cnn_weight ?? null,
    isDemo,
  });

  return NextResponse.json(result);
}
