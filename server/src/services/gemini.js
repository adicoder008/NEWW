import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildAnalysisPrompt } from "../prompts/analysisPrompt.js";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const DEFAULT_MODELS = ["gemini-2.5-flash-lite", "gemini-2.5-flash"];

function stripJsonFence(raw) {
  let text = raw.trim();
  if (text.startsWith("```")) {
    text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  }
  return text.trim();
}

function parseFeedbackJson(raw) {
  const text = stripJsonFence(raw);
  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(text.slice(start, end + 1));
    }
    throw new Error("Model returned invalid JSON");
  }
}

function errorText(e) {
  return String(e?.message || e?.statusText || e || "");
}

function isRateLimitError(e) {
  if (e?.status === 429) return true;
  const msg = errorText(e);
  return /quota exceeded|rate limit|too many requests|resource exhausted|resource_exhausted|\[429\]/i.test(
    msg
  );
}

function isInvalidKeyError(e) {
  const msg = errorText(e);
  return /api key not valid|invalid.*api.*key|API_KEY_INVALID|\[401\]|\[403\]/i.test(msg);
}

function isModelError(e) {
  if (e?.status === 404) return true;
  const msg = errorText(e);
  return /not found|no longer available|not supported for generateContent/i.test(msg);
}

function getModelsToTry() {
  const configured = (process.env.GEMINI_MODEL || "")
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);

  const merged = [...configured, ...DEFAULT_MODELS];
  return [...new Set(merged)];
}

async function generateOnce(model, prompt) {
  const result = await model.generateContent(prompt);
  return result.response.text();
}

async function generateWithRetries(genAI, modelName, prompt) {
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.35,
      responseMimeType: "application/json",
    },
  });

  const delays = [0, 2000, 5000];
  let lastError;

  for (let attempt = 0; attempt < delays.length; attempt++) {
    if (delays[attempt] > 0) await sleep(delays[attempt]);
    try {
      return await generateOnce(model, prompt);
    } catch (e) {
      lastError = e;
      if (!isRateLimitError(e) || attempt === delays.length - 1) throw e;
    }
  }

  throw lastError;
}

export async function analyzeWithGemini({
  resumeText,
  jobTitle,
  jobDescription,
  companyName,
}) {
  const apiKey = (process.env.GEMINI_API_KEY || "").trim();
  if (!apiKey || apiKey === "your_key_here") {
    const err = new Error("GEMINI_API_KEY missing in server/.env");
    err.code = "CONFIG_ERROR";
    throw err;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const prompt = buildAnalysisPrompt({
    resumeText,
    jobTitle,
    jobDescription,
    companyName,
  });

  const models = getModelsToTry();
  let lastError;

  for (const modelName of models) {
    try {
      const raw = await generateWithRetries(genAI, modelName, prompt);
      return parseFeedbackJson(raw);
    } catch (e) {
      lastError = e;
      console.error(`[gemini] ${modelName} failed:`, errorText(e).slice(0, 200));
      if (isRateLimitError(e)) continue;
      if (isModelError(e)) continue;
      break;
    }
  }

  if (isInvalidKeyError(lastError)) {
    const err = new Error("INVALID_API_KEY");
    err.code = "INVALID_API_KEY";
    throw err;
  }
  if (isRateLimitError(lastError)) {
    const err = new Error("RATE_LIMIT");
    err.code = "RATE_LIMIT";
    throw err;
  }
  if (isModelError(lastError)) {
    const err = new Error("MODEL_ERROR");
    err.code = "MODEL_ERROR";
    throw err;
  }
  if (/fetch|network|ECONNRESET|ETIMEDOUT/i.test(errorText(lastError))) {
    const err = new Error("NETWORK_ERROR");
    err.code = "NETWORK_ERROR";
    throw err;
  }
  const err = new Error("AI_ERROR");
  err.code = "AI_ERROR";
  throw err;
}
