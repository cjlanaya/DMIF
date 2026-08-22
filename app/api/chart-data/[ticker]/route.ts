import { NextRequest, NextResponse } from "next/server";
import { getCompanyChartData, isKnownTicker } from "@/lib/chart-data";

export async function GET(
  _req: NextRequest,
  { params }: { params: { ticker: string } }
) {
  const ticker = decodeURIComponent(params.ticker);
  if (!isKnownTicker(ticker)) {
    return NextResponse.json({ error: "unknown_ticker" }, { status: 404 });
  }
  const data = getCompanyChartData(ticker);
  return NextResponse.json({ ticker, data });
}
