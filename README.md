# Resumind

Resume analyzer with ATS scoring, job-description matching, and skills-gap feedback.

**Stack:** React Router · Tailwind · Zustand · Express · Gemini · pdf-parse · mammoth

## Run locally

**1. API**

```bash
cd server
cp .env.example .env
# add GEMINI_API_KEY from https://aistudio.google.com/apikey
npm install
npm run dev
```

**2. Frontend** (new terminal, repo root)

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. Vite proxies `/api` to port 3001.

## Deploy

- **Frontend (Vercel):** connect repo, build `npm run build`, output `build/client`. Set `VITE_API_URL` to your API origin.
- **API (Render, Railway, Fly, etc.):** deploy `server/`, set `GEMINI_API_KEY`, `CLIENT_ORIGIN` (your Vercel URL), `PORT`.

Analysis files are stored on disk under `server/data/` — fine for demos; swap in a DB or object storage when you outgrow it.

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/analyses` | `multipart/form-data`: `resume`, `jobTitle`, `jobDescription`, optional `companyName` |
| GET | `/api/analyses` | List recent analyses |
| GET | `/api/analyses/:id` | Full result |
| GET | `/api/analyses/:id/file` | Original upload |

Max upload size defaults to 5 MB (`MAX_FILE_MB`).
