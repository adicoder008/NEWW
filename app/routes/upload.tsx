import { type FormEvent, useState } from "react";
import Navbar from "../components/Navbar";
import FileUploader from "../components/FileUploader";
import Notice from "../components/Notice";
import AnalysisProgress from "../components/AnalysisProgress";
import { Link, useNavigate } from "react-router";
import { useAnalysisStore } from "../stores/useAnalysisStore";

const ASIDE_STEPS = [
  { n: "1", label: "Target role", detail: "Company, title, and job description" },
  { n: "2", label: "Your resume", detail: "PDF or DOCX upload" },
  { n: "3", label: "Report", detail: "ATS score and section feedback" },
];

const Upload = () => {
  const navigate = useNavigate();
  const { runAnalysis, status, statusMessage, error, clearError, resetAnalysis } =
    useAnalysisStore();
  const [file, setFile] = useState<File | null>(null);

  const isProcessing = status === "analyzing";
  const stepActive = file ? 2 : 1;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();
    if (!file) return;

    const formData = new FormData(e.currentTarget);
    formData.set("resume", file);

    const id = await runAnalysis(formData);
    if (id) navigate(`/resume/${id}`);
  };

  return (
    <main className="page-shell">
      <Navbar />

      <div className="content-wrap py-8 sm:py-12 pb-20">
        <div className="mb-8 lg:mb-10">
          <Link to="/" className="secondary-link inline-flex items-center gap-1.5 mb-4">
            ← Back
          </Link>
          <p className="eyebrow mb-3">New analysis</p>
          <h1 className="!text-3xl sm:!text-4xl lg:!text-5xl text-left max-w-2xl">
            Tailor your resume to one role
          </h1>
          <p className="mt-3 text-dark-200 text-lg max-w-xl text-left leading-relaxed">
            The more accurate your job description, the sharper your match score and skills gap
            report.
          </p>
        </div>

        <div className="upload-layout">
          <aside className="upload-aside">
            <p className="text-sm font-semibold text-gray-900">What happens next</p>
            {ASIDE_STEPS.map((s, i) => (
              <div
                key={s.n}
                className={`upload-aside-step ${i + 1 <= stepActive ? "active" : "opacity-60"}`}
              >
                <span>{s.n}</span>
                <div>
                  <p className="font-medium text-gray-900">{s.label}</p>
                  <p className="text-dark-200 mt-0.5">{s.detail}</p>
                </div>
              </div>
            ))}
            <div className="rounded-2xl bg-[#f4f7fe]/80 border border-[#c1d3f8]/50 p-4 text-sm text-dark-200 leading-relaxed">
              <p className="font-medium text-gray-900 mb-1">Tip</p>
              Paste the full job post — requirements and responsibilities help ATS keyword matching.
            </div>
          </aside>

          <div className="gradient-border w-full">
            <div className="form-panel">
              {isProcessing ? (
                <>
                  <AnalysisProgress message={statusMessage} />
                  <button
                    type="button"
                    className="mt-4 w-full text-center text-sm text-dark-200 hover:text-gray-800"
                    onClick={resetAnalysis}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <form onSubmit={handleSubmit} className="!gap-8">
                  {error && (
                    <Notice
                      variant={error.retryable ? "warning" : "error"}
                      title={error.title}
                      message={error.message}
                      hint={error.hint}
                      onDismiss={clearError}
                      action={
                        error.retryable
                          ? { label: "Dismiss and try again", onClick: clearError }
                          : undefined
                      }
                    />
                  )}

                  <fieldset className="form-section !gap-5 border-0 p-0 m-0">
                    <legend className="form-section-title w-full">Target role</legend>

                    <div className="form-div">
                      <label htmlFor="companyName">Company</label>
                      <input
                        id="companyName"
                        type="text"
                        name="companyName"
                        placeholder="Optional — e.g. Figma, NHS, Deloitte"
                        className="!rounded-xl !py-3.5"
                      />
                    </div>

                    <div className="form-div">
                      <label htmlFor="jobTitle">
                        Job title <span className="text-[#752522]">*</span>
                      </label>
                      <input
                        id="jobTitle"
                        type="text"
                        name="jobTitle"
                        required
                        placeholder="e.g. Senior Product Designer"
                        className="!rounded-xl !py-3.5"
                      />
                    </div>

                    <div className="form-div">
                      <label htmlFor="jobDescription">Job description</label>
                      <textarea
                        id="jobDescription"
                        rows={6}
                        name="jobDescription"
                        placeholder="Paste the full listing — responsibilities, requirements, nice-to-haves…"
                        className="!rounded-xl !py-3.5 resize-y min-h-[140px]"
                      />
                      <p className="text-xs text-dark-200/90">
                        Required if job title alone isn&apos;t enough for matching.
                      </p>
                    </div>
                  </fieldset>

                  <fieldset className="form-section !gap-4 border-0 p-0 m-0">
                    <legend className="form-section-title w-full">Resume file</legend>
                    <FileUploader onFileSelect={setFile} />
                  </fieldset>

                  <div className="pt-2 flex flex-col sm:flex-row gap-3 sm:items-center">
                    <button
                      type="submit"
                      disabled={!file}
                      className="primary-button !rounded-xl !py-3.5 text-base font-semibold disabled:opacity-40 disabled:cursor-not-allowed sm:flex-1"
                    >
                      {file ? "Run analysis" : "Upload a resume to continue"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Upload;
