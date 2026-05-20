import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataRoot = path.join(__dirname, "../../data");
const uploadsDir = path.join(dataRoot, "uploads");
const metaDir = path.join(dataRoot, "meta");

async function ensureDirs() {
  await fs.mkdir(uploadsDir, { recursive: true });
  await fs.mkdir(metaDir, { recursive: true });
}

export async function saveAnalysis(record) {
  await ensureDirs();
  const metaPath = path.join(metaDir, `${record.id}.json`);
  await fs.writeFile(metaPath, JSON.stringify(record, null, 2), "utf8");
  return record;
}

export async function getAnalysis(id) {
  try {
    const raw = await fs.readFile(path.join(metaDir, `${id}.json`), "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function listAnalyses() {
  await ensureDirs();
  let files = [];
  try {
    files = await fs.readdir(metaDir);
  } catch {
    return [];
  }

  const items = await Promise.all(
    files
      .filter((f) => f.endsWith(".json"))
      .map(async (f) => {
        const raw = await fs.readFile(path.join(metaDir, f), "utf8");
        const data = JSON.parse(raw);
        return {
          id: data.id,
          companyName: data.companyName,
          jobTitle: data.jobTitle,
          fileName: data.fileName,
          overallScore: data.feedback?.overallScore ?? null,
          createdAt: data.createdAt,
        };
      })
  );

  return items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function uploadPath(id, ext) {
  return path.join(uploadsDir, `${id}${ext}`);
}
