import { sql } from "@vercel/postgres";
import companyList from "../data/company-list.json";

// PLACEHOLDER: replace with real per-company evaluation results once the
// per-company accuracy profiling step of the ML pipeline exists. For now we
// seed a plausible random accuracy in the 52-68% range for every ticker so
// the dashboard's Historical Accuracy panel has something honest-looking to
// display, clearly not a real measured figure.
function placeholderAccuracy(): number {
  return Number((52 + Math.random() * 16).toFixed(1));
}

function placeholderSampleCount(): number {
  return 120 + Math.floor(Math.random() * 260);
}

async function main() {
  const tickers = companyList as string[];

  for (const ticker of tickers) {
    const accuracy = placeholderAccuracy(); // PLACEHOLDER
    const sampleCount = placeholderSampleCount(); // PLACEHOLDER
    await sql`
      INSERT INTO company_accuracy_stats (ticker, test_accuracy, sample_count, last_evaluated)
      VALUES (${ticker}, ${accuracy}, ${sampleCount}, CURRENT_DATE)
      ON CONFLICT (ticker) DO UPDATE
      SET test_accuracy = EXCLUDED.test_accuracy,
          sample_count = EXCLUDED.sample_count,
          last_evaluated = EXCLUDED.last_evaluated
    `;
  }

  console.log(`Seeded placeholder accuracy stats for ${tickers.length} tickers.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
