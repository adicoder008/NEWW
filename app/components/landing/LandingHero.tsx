import { Link } from "react-router";
import HeroPreview from "./HeroPreview";

type LandingHeroProps = {
  savedCount: number;
};

const TRUST = [
  { label: "ATS scoring", icon: "/icons/ats-good.svg" },
  { label: "Job matching", icon: "/icons/check.svg" },
  { label: "AI suggestions", icon: "/icons/info.svg" },
];

const LandingHero = ({ savedCount }: LandingHeroProps) => (
  <section className="land-hero">
    <div className="land-hero-grid">
      <div className="land-hero-copy">
        <span className="land-pill">
          <span className="land-pill-dot" />
          AI-powered resume intelligence
        </span>

        <h1 className="land-hero-title">
          Turn your resume into a{" "}
          <span className="text-gradient">role-ready</span> application
        </h1>

        <p className="land-hero-lead">
          Upload once, paste the job listing, and get ATS scores, match insights,
          skills gaps, and rewrite suggestions — built for serious job searches.
        </p>

        <div className="land-hero-cta">
          <Link to="/upload" className="land-btn-primary">
            Analyze my resume
          </Link>
          {savedCount > 0 ? (
            <a href="#reviews" className="land-btn-ghost">
              {savedCount} saved {savedCount === 1 ? "report" : "reports"}
            </a>
          ) : (
            <span className="land-hero-note">Free · ~30 seconds · PDF or DOCX</span>
          )}
        </div>

        <ul className="land-trust-row">
          {TRUST.map((t) => (
            <li key={t.label} className="land-trust-item">
              <img src={t.icon} alt="" className="size-4 opacity-80" />
              {t.label}
            </li>
          ))}
        </ul>
      </div>

      <HeroPreview />
    </div>
  </section>
);

export default LandingHero;
