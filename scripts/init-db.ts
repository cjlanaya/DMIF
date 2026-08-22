import { sql } from "@vercel/postgres";

async function main() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS predictions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      ticker TEXT NOT NULL,
      target_date DATE NOT NULL,
      direction TEXT NOT NULL,
      confidence NUMERIC NOT NULL,
      lstm_pct NUMERIC,
      cnn_pct NUMERIC,
      lstm_weight NUMERIC,
      cnn_weight NUMERIC,
      is_demo BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS company_accuracy_stats (
      ticker TEXT PRIMARY KEY,
      test_accuracy NUMERIC,
      sample_count INTEGER,
      last_evaluated DATE
    )
  `;

  console.log("Schema ready.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
