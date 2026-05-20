import multer from "multer";

const codeMap = {
  UNSUPPORTED_FORMAT: { status: 415, message: "Only PDF and DOCX files are supported." },
  EMPTY_RESUME: { status: 422, message: "Could not extract enough text from this resume." },
  CORRUPT_PDF: { status: 422, message: "This PDF could not be read. It may be corrupted or scanned without text." },
  PARSE_ERROR: { status: 422, message: "Could not parse this document." },
  RATE_LIMIT: {
    status: 503,
    message: "Analysis is temporarily unavailable due to high demand.",
    retryable: true,
  },
  NETWORK_ERROR: {
    status: 503,
    message: "Could not reach the analysis service.",
    retryable: true,
  },
  AI_ERROR: {
    status: 502,
    message: "Analysis could not be completed.",
    retryable: true,
  },
  CONFIG_ERROR: {
    status: 500,
    message: "Analysis service is not configured. Add GEMINI_API_KEY to server/.env",
    retryable: false,
  },
  INVALID_API_KEY: {
    status: 500,
    message: "The Gemini API key in server/.env is invalid or expired.",
    retryable: false,
  },
  MODEL_ERROR: {
    status: 502,
    message: "The configured AI model is unavailable. Check GEMINI_MODEL in server/.env.",
    retryable: false,
  },
};

export function errorHandler(err, _req, res, _next) {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        ok: false,
        error: {
          message: `File is too large. Max ${process.env.MAX_FILE_MB || 5} MB.`,
          code: "FILE_TOO_LARGE",
        },
      });
    }
    return res.status(400).json({
      ok: false,
      error: { message: err.message, code: err.code },
    });
  }

  if (err?.message === "UNSUPPORTED_FORMAT") {
    return res.status(415).json({
      ok: false,
      error: codeMap.UNSUPPORTED_FORMAT,
    });
  }

  const mapped = codeMap[err?.code];
  if (mapped) {
    return res.status(mapped.status).json({
      ok: false,
      error: {
        message: mapped.message,
        code: err.code,
        retryable: mapped.retryable ?? false,
      },
    });
  }

  console.error(err);
  res.status(500).json({
    ok: false,
    error: { message: "Something went wrong.", code: "INTERNAL_ERROR" },
  });
}
