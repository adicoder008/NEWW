const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

function url(path: string) {
  return baseUrl ? `${baseUrl}${path}` : path;
}

export class ApiError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

async function parseResponse<T>(res: Response): Promise<T> {
  const body = await res.json().catch(() => ({}));

  if (!res.ok || body.ok === false) {
    const err = body.error || {};
    throw new ApiError(
      err.message || "Request failed",
      err.code || "REQUEST_FAILED",
      res.status
    );
  }

  return body.data as T;
}

export type AnalysisSummary = {
  id: string;
  companyName: string | null;
  jobTitle: string | null;
  fileName: string;
  overallScore: number | null;
  createdAt: string;
};

export type AnalysisRecord = {
  id: string;
  companyName: string | null;
  jobTitle: string | null;
  jobDescription: string | null;
  fileName: string;
  mimeType: string;
  feedback: Feedback;
  createdAt: string;
};

export async function analyzeResume(
  form: FormData,
  signal?: AbortSignal
): Promise<{ id: string; feedback: Feedback; fileName: string }> {
  const res = await fetch(url("/api/analyses"), {
    method: "POST",
    body: form,
    signal,
  });
  return parseResponse(res);
}

export async function fetchAnalysis(id: string): Promise<AnalysisRecord> {
  const res = await fetch(url(`/api/analyses/${id}`));
  return parseResponse(res);
}

export async function fetchAnalyses(): Promise<AnalysisSummary[]> {
  const res = await fetch(url("/api/analyses"));
  return parseResponse(res);
}

export function analysisFileUrl(id: string) {
  return url(`/api/analyses/${id}/file`);
}
