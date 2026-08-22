import { NextResponse } from "next/server";
import { getCompanyList } from "@/lib/chart-data";

export async function GET() {
  return NextResponse.json({ companies: getCompanyList() });
}
