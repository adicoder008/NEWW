import { createRequire } from "module";
import mammoth from "mammoth";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

const MIN_TEXT_LENGTH = 40;

export async function extractResumeText(buffer, mimeType) {
  const type = (mimeType || "").toLowerCase();

  if (type === "application/pdf") {
    let parsed;
    try {
      parsed = await pdfParse(buffer);
    } catch {
      const err = new Error("Could not read this PDF. It may be corrupted or password-protected.");
      err.code = "CORRUPT_PDF";
      throw err;
    }

    const text = (parsed.text || "").replace(/\s+/g, " ").trim();
    if (text.length < MIN_TEXT_LENGTH) {
      const err = new Error("This PDF has little or no extractable text. Try a text-based PDF or DOCX.");
      err.code = "EMPTY_RESUME";
      throw err;
    }
    return text;
  }

  if (
    type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    type === "application/msword"
  ) {
    try {
      const { value } = await mammoth.extractRawText({ buffer });
      const text = (value || "").replace(/\s+/g, " ").trim();
      if (text.length < MIN_TEXT_LENGTH) {
        const err = new Error("This document appears empty or unreadable.");
        err.code = "EMPTY_RESUME";
        throw err;
      }
      return text;
    } catch (e) {
      if (e.code === "EMPTY_RESUME") throw e;
      const err = new Error("Could not parse this Word document.");
      err.code = "PARSE_ERROR";
      throw err;
    }
  }

  const err = new Error("Unsupported file type. Upload PDF or DOCX.");
  err.code = "UNSUPPORTED_FORMAT";
  throw err;
}
