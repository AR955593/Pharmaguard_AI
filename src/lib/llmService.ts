import { LLMExplanation, RiskLabel, Phenotype } from "@/types";

interface ExplanationContext {
  phenotype?: Phenotype;
  recommendation?: string;
}

const DEFAULT_CITATIONS = ["CPIC Guidelines", "PharmGKB", "FDA Drug Label"];
const REQUEST_TIMEOUT_MS = 10000;

const RISK_PLAIN_TEXT: Record<RiskLabel, string> = {
  Safe: "Your result suggests standard use is generally appropriate",
  "Adjust Dosage": "Your result suggests dose adjustment and closer monitoring may be needed",
  Toxic: "Your result suggests a higher chance of harmful side effects",
  Ineffective: "Your result suggests this drug may not work well for you",
  Unknown: "Your result is uncertain and should be reviewed with a clinician",
};

function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function buildLocalExplanation(drug: string, gene: string, risk: RiskLabel, context?: ExplanationContext): LLMExplanation {
  const phenotype = context?.phenotype && context.phenotype !== "Unknown" ? context.phenotype : "not clearly determined";
  const recommendation = normalizeText(context?.recommendation);
  const riskSentence = RISK_PLAIN_TEXT[risk] || RISK_PLAIN_TEXT.Unknown;

  const summary =
    `${riskSentence} for ${drug}. ` +
    `This conclusion is based on your ${gene} gene profile with phenotype ${phenotype}. ` +
    `Please confirm final treatment decisions with your clinician.`;

  const mechanism =
    `${gene} helps control how your body processes ${drug}. ` +
    `When gene activity differs from expected levels, drug levels may become too high, too low, or remain in the safe range.`;

  const citations = recommendation
    ? [...DEFAULT_CITATIONS, "Local Rule-Based Engine"]
    : [...DEFAULT_CITATIONS, "Local Rule-Based Engine"];

  return {
    summary,
    mechanism_of_action: recommendation
      ? `${mechanism} Current recommendation: ${recommendation}`
      : mechanism,
    citations,
  };
}

function parseProviderResponse(payload: any, fallback: LLMExplanation): LLMExplanation {
  const summary = normalizeText(payload?.summary);
  const mechanism = normalizeText(payload?.mechanism_of_action);
  const citations = Array.isArray(payload?.citations)
    ? payload.citations.map((c: unknown) => normalizeText(c)).filter(Boolean)
    : [];

  return {
    summary: summary || fallback.summary,
    mechanism_of_action: mechanism || fallback.mechanism_of_action,
    citations: citations.length > 0 ? citations : fallback.citations,
  };
}

async function fetchFromProxy(prompt: string): Promise<any> {
  const proxyUrl = normalizeText(process.env.NEXT_PUBLIC_LLM_PROXY_URL);
  if (!proxyUrl) return null;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(proxyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Proxy request failed (${response.status})`);
    }

    return await response.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

export const generateExplanation = async (
  drug: string,
  gene: string,
  risk: RiskLabel,
  context?: ExplanationContext,
): Promise<LLMExplanation> => {
  const fallback = buildLocalExplanation(drug, gene, risk, context);

  // Legacy key is intentionally ignored to avoid shipping secrets to every client.
  if (normalizeText(process.env.NEXT_PUBLIC_GEMINI_API_KEY)) {
    console.warn("NEXT_PUBLIC_GEMINI_API_KEY is set but ignored for security. Use NEXT_PUBLIC_LLM_PROXY_URL instead.");
  }

  const proxyUrl = normalizeText(process.env.NEXT_PUBLIC_LLM_PROXY_URL);
  if (!proxyUrl) {
    return fallback;
  }

  const prompt = [
    "You are a pharmacogenomics assistant. Return strict JSON.",
    `Drug: ${drug}`,
    `Gene: ${gene}`,
    `Risk label: ${risk}`,
    `Phenotype: ${context?.phenotype || "Unknown"}`,
    `Clinical recommendation: ${context?.recommendation || "Not provided"}`,
    'Format: {"summary":"...","mechanism_of_action":"...","citations":["..."]}',
  ].join("\n");

  try {
    const payload = await fetchFromProxy(prompt);
    if (!payload) return fallback;
    return parseProviderResponse(payload, fallback);
  } catch (error) {
    console.warn("LLM proxy unavailable. Using local explanation.", error);
    return fallback;
  }
};

