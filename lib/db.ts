import { sql } from "@vercel/postgres";

export type User = {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
};

export type PredictionRow = {
  id: number;
  user_id: number;
  ticker: string;
  target_date: string;
  direction: "UP" | "DOWN";
  confidence: number;
  lstm_pct: number | null;
  cnn_pct: number | null;
  lstm_weight: number | null;
  cnn_weight: number | null;
  is_demo: boolean;
  created_at: string;
};

export type CompanyAccuracyRow = {
  ticker: string;
  test_accuracy: number;
  sample_count: number;
  last_evaluated: string;
};

export async function getUserByEmail(email: string): Promise<User | null> {
  const { rows } = await sql<User>`
    SELECT * FROM users WHERE email = ${email} LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function createUser(
  name: string,
  email: string,
  passwordHash: string
): Promise<User> {
  const { rows } = await sql<User>`
    INSERT INTO users (name, email, password_hash)
    VALUES (${name}, ${email}, ${passwordHash})
    RETURNING *
  `;
  return rows[0];
}

export async function insertPrediction(params: {
  userId: number;
  ticker: string;
  targetDate: string;
  direction: "UP" | "DOWN";
  confidence: number;
  lstmPct: number | null;
  cnnPct: number | null;
  lstmWeight: number | null;
  cnnWeight: number | null;
  isDemo: boolean;
}): Promise<PredictionRow> {
  const { rows } = await sql<PredictionRow>`
    INSERT INTO predictions
      (user_id, ticker, target_date, direction, confidence, lstm_pct, cnn_pct, lstm_weight, cnn_weight, is_demo)
    VALUES
      (${params.userId}, ${params.ticker}, ${params.targetDate}, ${params.direction}, ${params.confidence},
       ${params.lstmPct}, ${params.cnnPct}, ${params.lstmWeight}, ${params.cnnWeight}, ${params.isDemo})
    RETURNING *
  `;
  return rows[0];
}

export async function getPredictionsForUser(userId: number): Promise<PredictionRow[]> {
  const { rows } = await sql<PredictionRow>`
    SELECT * FROM predictions
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
    LIMIT 200
  `;
  return rows;
}

export async function getAccuracyForTicker(
  ticker: string
): Promise<CompanyAccuracyRow | null> {
  const { rows } = await sql<CompanyAccuracyRow>`
    SELECT * FROM company_accuracy_stats WHERE ticker = ${ticker} LIMIT 1
  `;
  return rows[0] ?? null;
}
