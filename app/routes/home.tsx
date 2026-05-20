import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import LandingHero from "~/components/landing/LandingHero";
import LandingFeatureCard from "~/components/landing/LandingFeatureCard";
import ReviewCard from "~/components/landing/ReviewCard";
import { Link } from "react-router";
import { useEffect } from "react";
import { useAnalysisStore } from "~/stores/useAnalysisStore";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind — AI Resume & ATS Analysis" },
    { name: "description", content: "AI-powered resume analysis, ATS scoring, and job matching" },
  ];
}

const FEATURES = [
  {
    icon: "/icons/ats-good.svg",
    title: "ATS score analysis",
    description:
      "See how applicant tracking systems parse your layout, keywords, and formatting before a recruiter ever opens the file.",
    accent: "blue" as const,
  },
  {
    icon: "/icons/check.svg",
    title: "Job match insights",
    description:
      "Compare your experience against the listing you pasted — with a fit score and a plain-language summary.",
    accent: "violet" as const,
  },
  {
    icon: "/icons/warning.svg",
    title: "Skill gap detection",
    description:
      "Surface skills you already have and gaps to address, pulled directly from the job description.",
    accent: "rose" as const,
  },
  {
    icon: "/icons/info.svg",
    title: "AI resume suggestions",
    description:
      "Section-by-section feedback on tone, structure, content, and skills — with specific edits you can apply today.",
    accent: "slate" as const,
  },
];

export default function Home() {
  const { summaries, loadSummaries, status } = useAnalysisStore();

  useEffect(() => {
    loadSummaries();
  }, [loadSummaries]);

  const loading = status === "loading";

  return (
    <main className="landing-page">
      <Navbar />

      <div className="land-container">
        <LandingHero savedCount={summaries.length} />

        <section className="land-section land-features-section">
          <div className="land-section-head">
            <p className="land-eyebrow">Capabilities</p>
            <h2 className="land-section-title">Everything you need before you hit submit</h2>
            <p className="land-section-lead">
              One upload, one job post — four lenses on how competitive your application really is.
            </p>
          </div>
          <div className="land-features-grid">
            {FEATURES.map((f) => (
              <LandingFeatureCard key={f.title} {...f} />
            ))}
          </div>
        </section>

        <section id="reviews" className="land-section land-reviews-section">
          <div className="land-reviews-head">
            <div>
              <p className="land-eyebrow">Your workspace</p>
              <h2 className="land-section-title">Recent reviews</h2>
              <p className="land-section-lead land-section-lead--tight">
                Reopen any analysis — scores and feedback stay on this server.
              </p>
            </div>
            <Link to="/upload" className="land-btn-outline">
              + New analysis
            </Link>
          </div>

          {loading && (
            <div className="land-loading">
              <div className="land-spinner" />
            </div>
          )}

          {!loading && summaries.length === 0 && (
            <div className="land-empty">
              <p className="land-empty-title">No reviews yet</p>
              <p className="land-empty-text">
                Run your first analysis to start tracking applications and scores over time.
              </p>
              <Link to="/upload" className="land-btn-primary land-btn-primary--sm">
                Upload resume
              </Link>
            </div>
          )}

          {!loading && summaries.length > 0 && (
            <div className="land-reviews-grid">
              {summaries.map((item) => (
                <ReviewCard key={item.id} summary={item} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
