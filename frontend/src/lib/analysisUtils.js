const riskBands = [
  { min: 80, tier: "critical", label: "Critical", accent: "#EF4444" },
  { min: 60, tier: "high", label: "High", accent: "#F59E0B" },
  { min: 40, tier: "medium", label: "Medium", accent: "#8B5CF6" },
  { min: 15, tier: "low", label: "Low", accent: "#06B6D4" },
  { min: 0, tier: "safe", label: "Safe", accent: "#22C55E" },
];

const categoryMatchers = [
  {
    key: "URLs",
    label: "URLs",
    matchers: [/url/i, /link/i, /bit\.ly/i, /shorten/i, /http/i, /https/i],
  },
  {
    key: "Domains",
    label: "Domains",
    matchers: [/domain/i, /brand/i, /spoof/i, /lookalike/i, /website/i],
  },
  {
    key: "Sensitive Information",
    label: "Sensitive Information",
    matchers: [
      /password/i,
      /otp/i,
      /pin/i,
      /account/i,
      /bank/i,
      /credential/i,
      /personal/i,
    ],
  },
  {
    key: "Grammar",
    label: "Grammar",
    matchers: [
      /grammar/i,
      /spelling/i,
      /typo/i,
      /awkward/i,
      /incorrect/i,
      /errors?/i,
    ],
  },
  {
    key: "Social Engineering",
    label: "Social Engineering",
    matchers: [
      /urgency/i,
      /pressure/i,
      /threat/i,
      /manipulat/i,
      /fear/i,
      /reward/i,
      /verify now/i,
      /congratulations/i,
    ],
  },
];

const threatTemplates = {
  URLs: {
    description:
      "A link points to a destination that should be verified before any interaction.",
    severity: "High",
    examples: [
      "bit.ly redirect",
      "lookalike login URL",
      "URL embedded in urgency language",
    ],
    action: "Open the official app or bookmark instead of the message link.",
  },
  Domains: {
    description:
      "The sender or destination domain may imitate a trusted brand or internal portal.",
    severity: "High",
    examples: [
      "brand-suffix spoof",
      "punycode lookalike",
      "extra hyphen or subdomain trick",
    ],
    action:
      "Verify the sender using a trusted channel and inspect the full domain.",
  },
  "Sensitive Information": {
    description:
      "The message attempts to collect private credentials, OTPs, or account data.",
    severity: "Critical",
    examples: [
      "OTP requests",
      "password reset lure",
      "banking details request",
    ],
    action: "Never share credentials in response to a message prompt.",
  },
  Grammar: {
    description:
      "Poor phrasing or mechanical mistakes can reveal templated phishing content.",
    severity: "Medium",
    examples: [
      "unusual punctuation",
      "awkward wording",
      "misspelled brand terms",
    ],
    action: "Inspect the sender and compare with past legitimate messages.",
  },
  "Social Engineering": {
    description:
      "The message is trying to steer the target with urgency, fear, rewards, or authority.",
    severity: "Critical",
    examples: [
      "account locked warning",
      "limited-time reward",
      "executive impersonation",
    ],
    action:
      "Pause, verify independently, and escalate if the message changes behavior.",
  },
};

export function getRiskTier(score = 0) {
  return (
    riskBands.find((band) => score >= band.min) ??
    riskBands[riskBands.length - 1]
  );
}

export function getRiskLabel(score = 0) {
  return getRiskTier(score).label;
}

export function getRiskAccent(score = 0) {
  return getRiskTier(score).accent;
}

export function groupRedFlags(redFlags = []) {
  const groups = categoryMatchers.map((category) => ({
    ...category,
    items: [],
  }));

  redFlags.forEach((flag) => {
    const target = groups.find((category) =>
      category.matchers.some((pattern) => pattern.test(flag)),
    );
    const bucket = target ?? groups[0];
    bucket.items.push(flag);
  });

  return groups.filter(
    (category) =>
      category.items.length > 0 || category.key === "Social Engineering",
  );
}

export function buildRecommendations(analysis) {
  const score = Number(analysis?.risk_score ?? 0);
  const tier = getRiskTier(score).tier;

  const recommendations = [
    {
      title: "Do not interact with the message",
      description:
        "Avoid tapping links, opening attachments, or replying to the sender until you verify the source independently.",
      priority: "high",
    },
    {
      title: "Verify using official channels",
      description:
        "Use the bank, retailer, or service app directly instead of following the message instructions.",
      priority: "medium",
    },
  ];

  if (tier === "critical" || tier === "high") {
    recommendations.unshift({
      title: "Treat as a likely phishing attempt",
      description:
        "The message combines urgency, suspicious links, or spoofing patterns commonly used in account takeover scams.",
      priority: "critical",
    });
  }

  if (tier === "safe" || tier === "low") {
    recommendations.push({
      title: "Still keep verification habits",
      description:
        "Even low-risk messages should be checked for sender identity and destination links before taking action.",
      priority: "low",
    });
  }

  if ((analysis?.red_flags?.length ?? 0) > 3) {
    recommendations.push({
      title: "Escalate to your security team or bank",
      description:
        "Multiple independent red flags suggest coordinated social engineering rather than a harmless marketing message.",
      priority: "high",
    });
  }

  return recommendations;
}

export function buildThreatDetail(flag = "") {
  const normalized = String(flag).toLowerCase();

  const category =
    categoryMatchers.find((entry) =>
      entry.matchers.some((pattern) => pattern.test(normalized)),
    )?.key || "Social Engineering";

  const template =
    threatTemplates[category] ?? threatTemplates["Social Engineering"];

  return {
    category,
    title: flag,
    description: template.description,
    severity: template.severity,
    examples: template.examples,
    suggestedAction: template.action,
  };
}

export function summarizeAnalysis(analysis) {
  const score = Number(analysis?.risk_score ?? 0);
  const flags = analysis?.red_flags?.length ?? 0;

  if (!analysis) {
    return "No analysis available yet.";
  }

  if (score >= 80 || flags >= 4) {
    return "Critical phishing indicators detected. Treat this message as unsafe until verified.";
  }

  if (score >= 60) {
    return "High-risk content detected. The message should be verified through a trusted channel.";
  }

  if (score >= 40) {
    return "Moderate risk signals detected. Review the sender and link destination before acting.";
  }

  return "Low-risk signals detected. Continue using normal verification habits.";
}

export function summarizeHistory(history = []) {
  const total = history.length;
  const risks = history.map((item) => Number(item.result?.risk_score ?? 0));
  const averageRisk = total
    ? Math.round(risks.reduce((sum, value) => sum + value, 0) / total)
    : 0;
  const threatsPrevented = history.filter(
    (item) => Number(item.result?.risk_score ?? 0) >= 60,
  ).length;
  const safeMessages = history.filter(
    (item) => Number(item.result?.risk_score ?? 0) < 40,
  ).length;

  return {
    total,
    averageRisk,
    threatsPrevented,
    safeMessages,
    latestScore: risks[0] ?? 0,
  };
}

export function buildCategoryCounts(history = []) {
  const counts = Object.fromEntries(
    categoryMatchers.map((category) => [category.key, 0]),
  );

  history.forEach((item) => {
    item.result?.red_flags?.forEach((flag) => {
      const matched = categoryMatchers.find((category) =>
        category.matchers.some((pattern) => pattern.test(flag)),
      )?.key;

      if (matched) {
        counts[matched] += 1;
      }
    });
  });

  return counts;
}

export function buildTrendPoints(history = [], sampleSize = 7) {
  return history.slice(0, sampleSize).map((item, index, list) => ({
    label: formatTimestamp(item.timestamp),
    score: Number(item.result?.risk_score ?? 0),
    index,
    total: list.length,
  }));
}

export function formatTimestamp(timestamp) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

export function formatLongTimestamp(timestamp) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
}

export function formatCompactNumber(value) {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
  }).format(value);
}
