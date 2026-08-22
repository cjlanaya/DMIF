import fs from "node:fs";
import path from "node:path";

export type OHLCRecord = {
  Date: string;
  Open: number;
  High: number;
  Low: number;
  Close: number;
};

const DATA_DIR = path.join(process.cwd(), "data");
const CHART_DATA_DIR = path.join(DATA_DIR, "chart-data");
const COMPANY_LIST_PATH = path.join(DATA_DIR, "company-list.json");

let cachedCompanyList: string[] | null = null;

export function getCompanyList(): string[] {
  if (cachedCompanyList) return cachedCompanyList;
  const raw = fs.readFileSync(COMPANY_LIST_PATH, "utf-8");
  cachedCompanyList = JSON.parse(raw) as string[];
  return cachedCompanyList;
}

function sanitizeTicker(ticker: string): string {
  // Tickers look like "AAF.N" — restrict to that shape to avoid path traversal
  // when this value comes straight from a route param.
  if (!/^[A-Z0-9]+\.[A-Z0-9]+$/i.test(ticker)) {
    throw new Error(`Invalid ticker: ${ticker}`);
  }
  return ticker;
}

export function getCompanyChartData(ticker: string): OHLCRecord[] {
  const safeTicker = sanitizeTicker(ticker);
  const filePath = path.join(CHART_DATA_DIR, `${safeTicker}.json`);
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as OHLCRecord[];
}

export function isKnownTicker(ticker: string): boolean {
  try {
    return getCompanyList().includes(sanitizeTicker(ticker));
  } catch {
    return false;
  }
}
