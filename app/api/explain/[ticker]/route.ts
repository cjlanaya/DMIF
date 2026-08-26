import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isKnownTicker } from "@/lib/chart-data";

const FETCH_TIMEOUT_MS = 8000;

export type ExplainFeature = {
  feature: string;
  contribution: number;
  direction: "UP" | "DOWN";
};

export type ExplainResponse = {
  company: string;
  top_features: ExplainFeature[];
  note: string;
};

/**
 * Proxies to the same Flask + ngrok backend used by /api/predict, at
 * `${PREDICTION_API_BASE_URL}/explain/<ticker>`. This backend endpoint is
 * built separately (outside this repo, in the Colab notebook) — there is no
 * demo/simulated fallback here by design. If it isn't live yet, callers get
 * a plain "unavailable" signal, never fabricated data.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { ticker: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const ticker = decodeURIComponent(params.ticker);
  if (!isKnownTicker(ticker)) {
    return NextResponse.json({ error: "unknown_ticker" }, { status: 400 });
  }

  const baseUrl = process.env.PREDICTION_API_BASE_URL;
  if (!baseUrl) {
    return NextResponse.json({ available: false, error: "explain_engine_offline" }, { status: 503 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/explain/${ticker}`, {
      method: "GET",
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      return NextResponse.json(
        { available: false, error: "explain_engine_offline" },
        { status: 503 }
      );
    }
    const data = (await res.json()) as ExplainResponse;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ available: false, error: "explain_engine_offline" }, { status: 503 });
  } finally {
    clearTimeout(timeout);
  }
}
