import { Link, useParams } from "react-router";
import { useEffect, useState } from "react";
import Summary from "../components/Summary";
import ATS from "../components/ATS";
import Details from "../components/Details";
import JobMatch from "../components/JobMatch";
import Notice from "../components/Notice";
import { analysisFileUrl } from "../lib/api";
import { useAnalysisStore } from "../stores/useAnalysisStore";

export const meta = () => [
  { title: "Resumind | Review" },
  { name: "description", content: "Detailed overview of your resume" },
];

const Resume = () => {
  const { id } = useParams();
  const { getAnalysis, error, clearError } = useAnalysisStore();
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [meta, setMeta] = useState<{
    jobTitle?: string | null;
    companyName?: string | null;
  }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    (async () => {
      setLoading(true);
      clearError();
      const record = await getAnalysis(id);
      if (cancelled) return;

      if (record) {
        setFeedback(record.feedback);
        setMeta({ jobTitle: record.jobTitle, companyName: record.companyName });
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [id, getAnalysis, clearError]);

  const fileUrl = id ? analysisFileUrl(id) : "";
  const subtitle = [meta.companyName, meta.jobTitle].filter(Boolean).join(" · ");

  return (
    <main className="page-shell !min-h-screen">
      <header className="resume-nav sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <Link to="/" className="back-button !shadow-none">
          <img src="/icons/back.svg" alt="" className="w-2.5 h-2.5" />
          <span className="text-gray-800 text-sm font-semibold">All reviews</span>
        </Link>
        {subtitle && (
          <p className="text-sm text-dark-200 max-md:hidden truncate max-w-[40vw]">{subtitle}</p>
        )}
      </header>

      <div className="flex flex-row w-full max-lg:flex-col-reverse max-w-[1600px] mx-auto">
        <section className="feedback-section !bg-transparent !h-auto lg:sticky lg:top-16 lg:self-start">
          {fileUrl && (
            <div className="gradient-border max-sm:m-0 w-full">
              <iframe
                title="Resume preview"
                src={fileUrl}
                className="w-full min-h-[420px] lg:min-h-[calc(100vh-8rem)] rounded-xl bg-white"
              />
            </div>
          )}
        </section>

        <section className="feedback-section !w-full lg:!w-1/2">
          <div className="mb-2">
            <h1 className="!text-3xl sm:!text-4xl !text-black font-bold">Your review</h1>
            {subtitle && (
              <p className="mt-2 text-dark-200 lg:hidden">{subtitle}</p>
            )}
          </div>

          {error && (
            <Notice
              title={error.title}
              message={error.message}
              hint={error.hint}
              variant="error"
              onDismiss={clearError}
            />
          )}

          {loading && (
            <div className="flex flex-col items-center py-20">
              <div className="size-10 rounded-full border-2 border-[#c1d3f8] border-t-[#606beb] animate-spin" />
              <p className="mt-4 text-dark-200">Loading your report…</p>
            </div>
          )}

          {!loading && feedback && (
            <div className="flex flex-col gap-8 animate-in fade-in duration-700">
              <Summary feedback={feedback} />
              <JobMatch feedback={feedback} />
              <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
              <Details feedback={feedback} />
            </div>
          )}

          {!loading && !feedback && !error && (
            <p className="text-dark-200 py-8">This review could not be found.</p>
          )}
        </section>
      </div>
    </main>
  );
};

export default Resume;
