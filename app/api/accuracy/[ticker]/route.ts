import { NextRequest, NextResponse } from "next/server";
import { isKnownTicker } from "@/lib/chart-data";
import { getAccuracyForTicker } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: { ticker: string } }
) {
  const ticker = decodeURIComponent(params.ticker);
  if (!isKnownTicker(ticker)) {
    return NextResponse.json({ error: "unknown_ticker" }, { status: 404 });
  }
  const stats = await getAccuracyForTicker(ticker);
  return NextResponse.json({ stats });
}
