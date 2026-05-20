type LandingFeatureCardProps = {
  icon: string;
  title: string;
  description: string;
  accent?: "blue" | "violet" | "rose" | "slate";
};

const accentMap = {
  blue: "group-hover:border-[#606beb]/30 group-hover:shadow-[0_12px_40px_-16px_rgba(96,107,235,0.35)]",
  violet: "group-hover:border-violet-200 group-hover:shadow-[0_12px_40px_-16px_rgba(139,92,246,0.25)]",
  rose: "group-hover:border-rose-200 group-hover:shadow-[0_12px_40px_-16px_rgba(244,63,94,0.2)]",
  slate: "group-hover:border-slate-200 group-hover:shadow-[0_12px_40px_-16px_rgba(15,23,42,0.12)]",
};

const iconBg = {
  blue: "bg-[#eef1ff] text-[#606beb]",
  violet: "bg-violet-50 text-violet-600",
  rose: "bg-rose-50 text-rose-600",
  slate: "bg-slate-100 text-slate-600",
};

const LandingFeatureCard = ({
  icon,
  title,
  description,
  accent = "blue",
}: LandingFeatureCardProps) => (
  <article
    className={`land-feature-card group ${accentMap[accent]}`}
  >
    <div className={`land-feature-icon ${iconBg[accent]}`}>
      <img src={icon} alt="" className="size-5" />
    </div>
    <h3 className="land-feature-title">{title}</h3>
    <p className="land-feature-desc">{description}</p>
    <span className="land-feature-link">Learn more →</span>
  </article>
);

export default LandingFeatureCard;
