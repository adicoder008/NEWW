import { Router } from "express";
import { uploadResume } from "../middleware/upload.js";
import { validateAnalyze } from "../middleware/validateAnalyze.js";
import {
  createAnalysis,
  getAnalysisById,
  getAnalysisFile,
  listAll,
} from "../controllers/analysisController.js";

const router = Router();

function handleUpload(req, res, next) {
  uploadResume(req, res, (err) => {
    if (err) return next(err);
    next();
  });
}

router.get("/", listAll);
router.get("/:id/file", getAnalysisFile);
router.get("/:id", getAnalysisById);
router.post("/", handleUpload, validateAnalyze, createAnalysis);

export default router;
