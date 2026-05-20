import { create } from "zustand";
import {
  analyzeResume,
  fetchAnalyses,
  fetchAnalysis,
  type AnalysisSummary,
  ApiError,
} from "../lib/api";
import { mapApiError, mapUnknownError, type UserError } from "../lib/errors";

type Status = "idle" | "loading" | "analyzing" | "error";

type AnalysisState = {
  summaries: AnalysisSummary[];
  status: Status;
  statusMessage: string;
  error: UserError | null;
  abortController: AbortController | null;

  loadSummaries: () => Promise<void>;
  runAnalysis: (form: FormData) => Promise<string | null>;
  getAnalysis: (id: string) => Promise<{
    id: string;
    companyName: string | null;
    jobTitle: string | null;
    feedback: Feedback;
    fileName: string;
  } | null>;
  clearError: () => void;
  resetAnalysis: () => void;
};

export const useAnalysisStore = create<AnalysisState>((set, get) => ({
  summaries: [],
  status: "idle",
  statusMessage: "",
  error: null,
  abortController: null,

  clearError: () => set({ error: null, status: "idle" }),

  resetAnalysis: () => {
    get().abortController?.abort();
    set({
      status: "idle",
      statusMessage: "",
      error: null,
      abortController: null,
    });
  },

  loadSummaries: async () => {
    set({ status: "loading", error: null });
    try {
      const summaries = await fetchAnalyses();
      set({ summaries, status: "idle" });
    } catch (e) {
      const error =
        e instanceof ApiError ? mapApiError(e) : mapUnknownError();
      set({ status: "idle", error });
    }
  },

  runAnalysis: async (form) => {
    const { abortController } = get();
    if (abortController) {
      return null;
    }

    const controller = new AbortController();
    set({
      abortController: controller,
      status: "analyzing",
      statusMessage: "Parsing resume…",
      error: null,
    });

    const steps = [
      { at: 2000, text: "Matching to job description…" },
      { at: 5000, text: "Building your score report…" },
    ];
    const timers = steps.map(({ at, text }) =>
      setTimeout(() => {
        if (get().status === "analyzing") {
          set({ statusMessage: text });
        }
      }, at)
    );

    try {
      const result = await analyzeResume(form, controller.signal);
      set({ statusMessage: "Done" });
      await get().loadSummaries();
      set({ status: "idle", abortController: null });
      return result.id;
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") {
        set({ status: "idle", abortController: null });
        return null;
      }
      const error =
        e instanceof ApiError ? mapApiError(e) : mapUnknownError();
      set({ status: "error", error, abortController: null });
      return null;
    } finally {
      timers.forEach(clearTimeout);
    }
  },

  getAnalysis: async (id) => {
    try {
      const record = await fetchAnalysis(id);
      return {
        id: record.id,
        companyName: record.companyName,
        jobTitle: record.jobTitle,
        feedback: record.feedback,
        fileName: record.fileName,
      };
    } catch (e) {
      const error =
        e instanceof ApiError ? mapApiError(e) : mapUnknownError();
      set({ error });
      return null;
    }
  },
}));
