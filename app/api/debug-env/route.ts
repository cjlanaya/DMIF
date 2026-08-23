import { NextResponse } from "next/server";

// TEMPORARY diagnostic route — reports only presence/shape of required env
// vars, never their values. Remove once the missing_connection_string issue
// on Vercel is resolved.
export async function GET() {
  const postgresUrl = process.env.POSTGRES_URL;
  return NextResponse.json({
    hasPostgresUrl: Boolean(postgresUrl),
    postgresUrlLength: postgresUrl?.length ?? 0,
    postgresUrlHostPreview: postgresUrl
      ? postgresUrl.split("@")[1]?.split("/")[0]?.slice(0, 40)
      : null,
    hasSessionSecret: Boolean(process.env.SESSION_SECRET),
    hasPredictionApiBaseUrl: Boolean(process.env.PREDICTION_API_BASE_URL),
    demoMode: process.env.DEMO_MODE ?? null,
    nodeEnv: process.env.NODE_ENV ?? null,
    vercelEnv: process.env.VERCEL_ENV ?? null,
  });
}
