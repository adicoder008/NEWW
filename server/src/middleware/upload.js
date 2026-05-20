import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const maxMb = Number(process.env.MAX_FILE_MB || 5);
const maxBytes = maxMb * 1024 * 1024;

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../../data/uploads"),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^\w.\-]+/g, "_").slice(0, 80);
    cb(null, `${Date.now()}-${safe}`);
  },
});

const allowed = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export const uploadResume = multer({
  storage,
  limits: { fileSize: maxBytes, files: 1 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const byExt = ext === ".pdf" || ext === ".docx";
    const byMime = allowed.has(file.mimetype);

    if (byExt || byMime) {
      cb(null, true);
      return;
    }
    cb(new Error("UNSUPPORTED_FORMAT"));
  },
}).single("resume");
