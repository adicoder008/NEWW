export function validateAnalyze(req, res, next) {
  if (!req.file) {
    return res.status(400).json({
      ok: false,
      error: { message: "Resume file is required.", code: "MISSING_FILE" },
    });
  }

  if (req.file.size === 0) {
    return res.status(400).json({
      ok: false,
      error: { message: "The uploaded file is empty.", code: "EMPTY_FILE" },
    });
  }

  const jobTitle = String(req.body.jobTitle || "").trim();
  const jobDescription = String(req.body.jobDescription || "").trim();

  if (!jobTitle && !jobDescription) {
    return res.status(400).json({
      ok: false,
      error: {
        message: "Add a job title or paste the job description so we can match your resume.",
        code: "MISSING_JOB_INFO",
      },
    });
  }

  next();
}
