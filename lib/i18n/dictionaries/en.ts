export type Dictionary = {
  common: Record<
    | "appName"
    | "appFullName"
    | "tagline"
    | "signIn"
    | "signUp"
    | "logout"
    | "loading"
    | "save"
    | "cancel"
    | "close"
    | "language"
    | "theme"
    | "light"
    | "dark",
    string
  >;
  nav: Record<"dashboard" | "history" | "home", string>;
  landing: Record<
    | "heroEyebrow"
    | "heroTitle"
    | "heroSubtitle"
    | "ctaPrimary"
    | "ctaSecondary"
    | "featureDualModelTitle"
    | "featureDualModelDesc"
    | "featureCseTitle"
    | "featureCseDesc"
    | "featureResearchTitle"
    | "featureResearchDesc"
    | "disclaimer"
    | "footerRights",
    string
  >;
  auth: Record<
    | "registerTitle"
    | "registerSubtitle"
    | "loginTitle"
    | "loginSubtitle"
    | "nameLabel"
    | "namePlaceholder"
    | "emailLabel"
    | "emailPlaceholder"
    | "passwordLabel"
    | "passwordPlaceholder"
    | "confirmPasswordLabel"
    | "submitRegister"
    | "submitLogin"
    | "submitting"
    | "haveAccount"
    | "noAccount"
    | "switchToLogin"
    | "switchToRegister"
    | "errorEmailTaken"
    | "errorInvalidCredentials"
    | "errorPasswordMismatch"
    | "errorPasswordShort"
    | "errorMissingFields"
    | "errorGeneric",
    string
  >;
  dashboard: Record<
    | "title"
    | "selectCompanyLabel"
    | "searchPlaceholder"
    | "chartTitle"
    | "chartEmpty"
    | "predictionPanelTitle"
    | "targetDateLabel"
    | "nextTradingDayHint"
    | "multiStepHint"
    | "runPrediction"
    | "runningPrediction"
    | "resultFor"
    | "directionUp"
    | "directionDown"
    | "confidenceLabel"
    | "upProbabilityLabel"
    | "downProbabilityLabel"
    | "modelBreakdownTitle"
    | "lstmLabel"
    | "cnnLabel"
    | "fusionNote"
    | "accuracyPanelTitle"
    | "testAccuracyLabel"
    | "sampleCountLabel"
    | "lastEvaluatedLabel"
    | "accuracyNote"
    | "demoDataBadge"
    | "multiStepBadge"
    | "offlineTitle"
    | "offlineMessage"
    | "selectCompanyPrompt"
    | "noChartData"
    | "noAccuracyData"
    | "explainButton"
    | "explainLoading"
    | "explainUnavailable"
    | "explainContributionLabel",
    string
  >;
  history: Record<
    | "title"
    | "empty"
    | "columnTicker"
    | "columnRequested"
    | "columnTargetDate"
    | "columnDirection"
    | "columnConfidence"
    | "columnSource"
    | "sourceDemo"
    | "sourceLive",
    string
  >;
  footer: Record<"disclaimer", string>;
};

const dict: Dictionary = {
  common: {
    appName: "DMIF",
    appFullName: "Dual-Modal Intelligence Framework",
    tagline: "CSE direction research, from two models at once.",
    signIn: "Sign In",
    signUp: "Create Account",
    logout: "Log Out",
    loading: "Loading…",
    save: "Save",
    cancel: "Cancel",
    close: "Close",
    language: "Language",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
  },
  nav: {
    dashboard: "Dashboard",
    history: "Prediction History",
    home: "Home",
  },
  landing: {
    heroEyebrow: "Final-year research prototype · Colombo Stock Exchange",
    heroTitle: "Two models. One ledger. A single direction call.",
    heroSubtitle:
      "DMIF fuses an LSTM reading technical indicators with a CNN reading candlestick charts to estimate whether a CSE-listed stock closes up or down the next trading day.",
    ctaPrimary: "Sign In",
    ctaSecondary: "Create an Account",
    featureDualModelTitle: "Dual-modal fusion",
    featureDualModelDesc:
      "An LSTM over 30-day technical indicator sequences and a CNN over candlestick images are combined by a logistic regression meta-learner.",
    featureCseTitle: "80 CSE companies",
    featureCseDesc:
      "Built on two years of historical daily OHLC data across 80 Colombo Stock Exchange listings.",
    featureResearchTitle: "Research-grade honesty",
    featureResearchDesc:
      "Confidence is shown plainly, per-company accuracy is disclosed, and multi-step forecasts are labeled as estimates, not certainties.",
    disclaimer:
      "Predictions shown on this platform are produced for academic research purposes only and do not constitute financial advice.",
    footerRights: "Built as a BSc Computer Science dissertation project.",
  },
  auth: {
    registerTitle: "Create your account",
    registerSubtitle: "Track predictions across sessions and companies.",
    loginTitle: "Welcome back",
    loginSubtitle: "Sign in to reach your dashboard.",
    nameLabel: "Full name",
    namePlaceholder: "K. Perera",
    emailLabel: "Email address",
    emailPlaceholder: "you@example.com",
    passwordLabel: "Password",
    passwordPlaceholder: "At least 8 characters",
    confirmPasswordLabel: "Confirm password",
    submitRegister: "Create Account",
    submitLogin: "Sign In",
    submitting: "Please wait…",
    haveAccount: "Already have an account?",
    noAccount: "Don't have an account yet?",
    switchToLogin: "Sign in",
    switchToRegister: "Register",
    errorEmailTaken: "That email is already registered — try signing in instead.",
    errorInvalidCredentials: "That email and password combination doesn't match our records.",
    errorPasswordMismatch: "The passwords you entered don't match.",
    errorPasswordShort: "Passwords need to be at least 8 characters.",
    errorMissingFields: "Please fill in every field before continuing.",
    errorGeneric: "Something went wrong on our end — please try again.",
  },
  dashboard: {
    title: "Dashboard",
    selectCompanyLabel: "Company",
    searchPlaceholder: "Search tickers…",
    chartTitle: "Price history",
    chartEmpty: "Select a company to load its chart.",
    predictionPanelTitle: "Prediction",
    targetDateLabel: "Target date",
    nextTradingDayHint:
      "Direct next-day prediction available for {date}. Later dates use multi-step estimation with reduced confidence.",
    multiStepHint:
      "Dates further out are estimated by iteratively feeding each day's predicted close back into the model — confidence drops the further out you go.",
    runPrediction: "Run Prediction",
    runningPrediction: "Running prediction…",
    resultFor: "Prediction for",
    directionUp: "UP",
    directionDown: "DOWN",
    confidenceLabel: "Confidence",
    upProbabilityLabel: "P(up)",
    downProbabilityLabel: "P(down)",
    modelBreakdownTitle: "Model breakdown",
    lstmLabel: "LSTM (technical indicators)",
    cnnLabel: "CNN (candlestick pattern)",
    fusionNote: "Combined by the fusion layer's learned weights.",
    accuracyPanelTitle: "Historical accuracy",
    testAccuracyLabel: "Test accuracy",
    sampleCountLabel: "Evaluation samples",
    lastEvaluatedLabel: "Last evaluated",
    accuracyNote: "Precomputed per-company evaluation, not calculated live.",
    demoDataBadge: "Demo data — sample, not a live model output",
    multiStepBadge: "Multi-step estimate",
    offlineTitle: "Prediction engine offline",
    offlineMessage:
      "The prediction engine is offline right now — the model runs from a research notebook that isn't always active. Try again shortly.",
    selectCompanyPrompt: "Choose a company above to get started.",
    noChartData: "No chart data available for this company yet.",
    noAccuracyData: "No accuracy stats recorded for this company yet.",
    explainButton: "Explain this prediction",
    explainLoading: "Loading explanation…",
    explainUnavailable: "Explanation unavailable right now.",
    explainContributionLabel: "Contribution",
  },
  history: {
    title: "Prediction History",
    empty: "No predictions yet — run one from the Dashboard.",
    columnTicker: "Ticker",
    columnRequested: "Requested",
    columnTargetDate: "Target date",
    columnDirection: "Direction",
    columnConfidence: "Confidence",
    columnSource: "Source",
    sourceDemo: "Demo",
    sourceLive: "Live",
  },
  footer: {
    disclaimer:
      "For academic research purposes only. Not financial advice.",
  },
};

export default dict;
