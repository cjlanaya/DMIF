/**
 * Human-readable labels for the raw technical-indicator feature codes
 * returned by the /explain/<ticker> backend endpoint. Display-only — the
 * codes themselves are what the model actually uses; this just makes the
 * "Explain this prediction" panel legible to a non-technical user.
 */
export const FEATURE_LABELS: Record<string, string> = {
  Open: "Open Price",
  High: "High Price",
  Low: "Low Price",
  Close: "Close Price",
  Log_Volume: "Trading Volume (log-scaled)",
  Daily_Return: "Daily Return",
  Log_Return: "Log Return",
  HL_Range: "High-Low Range",
  OC_Range: "Open-Close Range",
  MA_24: "24-Day Moving Average",
  MA_30: "30-Day Moving Average",
  MA_500: "500-Day Moving Average",
  RSI: "Relative Strength Index (RSI)",
  MACD: "MACD (Trend Momentum)",
  MACD_Signal: "MACD Signal Line",
  MACD_Hist: "MACD Histogram",
  BB_Upper: "Bollinger Band (Upper)",
  BB_Lower: "Bollinger Band (Lower)",
  BB_Middle: "Bollinger Band (Middle)",
  BB_Width: "Bollinger Band Width (Volatility)",
  Volatility_10: "10-Day Volatility",
  SAR: "Parabolic SAR (Trend Reversal)",
  SAR_Trend: "SAR Trend Direction",
  Fib_0236: "Fibonacci Retracement 23.6%",
  Fib_0382: "Fibonacci Retracement 38.2%",
  Fib_05: "Fibonacci Retracement 50%",
  Fib_0618: "Fibonacci Retracement 61.8%",
  Fib_0786: "Fibonacci Retracement 78.6%",
  Volume_MA_10: "10-Day Average Volume",
  Volume_Ratio: "Volume Ratio (vs. Average)",
};

/** Falls back to the raw code as-is if it isn't in the mapping. */
export function getFeatureLabel(code: string): string {
  return FEATURE_LABELS[code] ?? code;
}
