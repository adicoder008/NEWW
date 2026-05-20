import { ApiError } from "./api";

export type UserError = {
  code: string;
  title: string;
  message: string;
  hint?: string;
  retryable?: boolean;
};

export function mapApiError(error: ApiError): UserError {
  switch (error.code) {
    case "RATE_LIMIT":
      return {
        code: error.code,
        title: "Google API limit hit",
        message:
          "Gemini's free tier is temporarily capped. Wait a minute, then try again once.",
        hint: "Don't click analyze repeatedly — each click uses quota.",
        retryable: true,
      };
    case "MODEL_ERROR":
      return {
        code: error.code,
        title: "AI model misconfigured",
        message:
          "The server is pointing at a Gemini model that no longer exists. Set GEMINI_MODEL=gemini-2.5-flash-lite in server/.env and restart the API.",
        retryable: false,
      };
    case "NETWORK_ERROR":
      return {
        code: error.code,
        title: "Connection interrupted",
        message: "The server lost contact mid-request. Check your network and try once more.",
        retryable: true,
      };
    case "AI_ERROR":
      return {
        code: error.code,
        title: "Analysis didn't complete",
        message: "Something went wrong while generating feedback. Please try again.",
        retryable: true,
      };
    case "FILE_TOO_LARGE":
      return {
        code: error.code,
        title: "File too large",
        message: error.message,
        retryable: false,
      };
    case "EMPTY_RESUME":
    case "CORRUPT_PDF":
    case "PARSE_ERROR":
      return {
        code: error.code,
        title: "Couldn't read this file",
        message: error.message,
        hint: "Text-based PDFs and DOCX files work best. Scanned images may not parse.",
        retryable: false,
      };
    case "UNSUPPORTED_FORMAT":
      return {
        code: error.code,
        title: "Unsupported format",
        message: "Upload a PDF or DOCX file.",
        retryable: false,
      };
    case "MISSING_JOB_INFO":
      return {
        code: error.code,
        title: "Job details needed",
        message: "Add a job title or paste the job description so we can tailor the review.",
        retryable: false,
      };
    case "CONFIG_ERROR":
      return {
        code: error.code,
        title: "API not configured",
        message:
          "The backend is missing a Gemini key. Add GEMINI_API_KEY to server/.env (not .env.example), then restart the API.",
        retryable: false,
      };
    case "INVALID_API_KEY":
      return {
        code: error.code,
        title: "Invalid API key",
        message:
          "The Gemini key in server/.env was rejected. Create a new key at Google AI Studio and paste it there, then restart the API.",
        hint: "Use server/.env only — never put your real key in .env.example.",
        retryable: false,
      };
    default:
      return {
        code: error.code,
        title: "Something went wrong",
        message: error.message || "Please try again.",
        retryable: error.status >= 500 || error.status === 429,
      };
  }
}

export function mapUnknownError(): UserError {
  return {
    code: "UNKNOWN",
    title: "Something went wrong",
    message: "Check that the API is running, then try again.",
    retryable: true,
  };
}
