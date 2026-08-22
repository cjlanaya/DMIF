import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getPredictionsForUser } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const predictions = await getPredictionsForUser(session.userId);
  return NextResponse.json({ predictions });
}
