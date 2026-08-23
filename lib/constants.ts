/**
 * The bundled historical dataset (`data/chart-data/*.json`) ends on this
 * date — it is the last day the LSTM/CNN models actually have real price
 * history for. A "direct next trading day" prediction can only genuinely be
 * made for the trading day immediately after this one; anything later must
 * go through the iterative multi-step estimate path.
 *
 * Update this if the dataset is ever refreshed with more recent data.
 */
export const DATASET_LAST_TRADING_DATE = "2026-02-24";
