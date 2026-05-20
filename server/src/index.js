import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { createApp } from "./app.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "../.env");
dotenv.config({ path: envPath });

await fs.mkdir(path.join(__dirname, "../data/uploads"), { recursive: true });
await fs.mkdir(path.join(__dirname, "../data/meta"), { recursive: true });

const key = (process.env.GEMINI_API_KEY || "").trim();
const keyOk = key.length > 0 && key !== "your_key_here";

const port = Number(process.env.PORT || 3001);
const app = createApp();

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
  console.log(`Env file: ${envPath}`);
  console.log(`Gemini key: ${keyOk ? "loaded" : "MISSING — edit server/.env and restart"}`);
});
