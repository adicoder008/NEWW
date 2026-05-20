import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { extractResumeText } from "../services/parseResume.js";
import { analyzeWithGemini } from "../services/gemini.js";
import {
  saveAnalysis,
  getAnalysis,
  listAnalyses,
  uploadPath,
} from "../services/analysisStore.js";
import { ok, fail } from "../utils/responses.js";

export async function createAnalysis(req, res, next) {
  const tempPath = req.file.path;
  const id = crypto.randomUUID();
  const ext = path.extname(req.file.originalname).toLowerCase() || ".pdf";
  const finalPath = uploadPath(id, ext);

  try {
    const buffer = await fs.readFile(tempPath);
    const resumeText = await extractResumeText(buffer, req.file.mimetype);

    const feedback = await analyzeWithGemini({
      resumeText,
      jobTitle: req.body.jobTitle,
      jobDescription: req.body.jobDescription,
      companyName: req.body.companyName,
    });

    await fs.rename(tempPath, finalPath);

    const record = {
      id,
      companyName: String(req.body.companyName || "").trim() || null,
      jobTitle: String(req.body.jobTitle || "").trim() || null,
      jobDescription: String(req.body.jobDescription || "").trim() || null,
      fileName: req.file.originalname,
      mimeType: req.file.mimetype,
      filePath: finalPath,
      feedback,
      createdAt: new Date().toISOString(),
    };

    await saveAnalysis(record);
    return ok(res, { id, feedback, fileName: record.fileName }, 201);
  } catch (e) {
    await fs.unlink(tempPath).catch(() => {});
    next(e);
  }
}

export async function getAnalysisById(req, res) {
  const record = await getAnalysis(req.params.id);
  if (!record) {
    return fail(res, "Analysis not found.", 404, "NOT_FOUND");
  }

  const { filePath, ...safe } = record;
  return ok(res, safe);
}

export async function getAnalysisFile(req, res) {
  const record = await getAnalysis(req.params.id);
  if (!record?.filePath) {
    return fail(res, "File not found.", 404, "NOT_FOUND");
  }

  try {
    await fs.access(record.filePath);
  } catch {
    return fail(res, "File not found.", 404, "NOT_FOUND");
  }

  res.setHeader("Content-Type", record.mimeType || "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `inline; filename="${record.fileName || "resume"}"`
  );
  return res.sendFile(path.resolve(record.filePath));
}

export async function listAll(req, res) {
  const items = await listAnalyses();
  return ok(res, items);
}
