import { Link } from "react-router";
import type { AnalysisSummary } from "~/lib/api";

function scoreTone(score: number) {
  if (score > 69) return { ring: "#606beb", text: "text-emerald-700", bg: "bg-emerald-50" };
  if (score > 49) return { ring: "#d97706", text: "text-amber-700", bg: "bg-amber-50" };
  return { ring: "#dc2626", text: "text-red-700", bg: "bg-red-50" };
}

const MiniScore = ({ score }: { score: number }) => {
  const r = 18;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - score / 100);
  const tone = scoreTone(score);

  return (
    <div className="relative size-12 shrink-0">
      <svg className="size-full -rotate-90" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r={r} fill="none" stroke="#eef2ff" strokeWidth="4" />
        <circle
          cx="22"
          cy="22"
          r={r}
          fill="none"
          stroke={tone.ring}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-slate-800">
        {score}
      </span>
    </div>
  );
};

const ReviewCard = ({ summary }: { summary: AnalysisSummary }) => {
  const score = summary.overallScore ?? 0;
  const label = summary.companyName || summary.fileName;
  const sub = summary.jobTitle || "Resume review";
  const date = new Date(summary.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const tone = scoreTone(score);

  return (
    <Link to={`/resume/${summary.id}`} className="land-review-card group">
      <MiniScore score={score} />
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">{date}</p>
        <h3 className="text-base font-semibold text-slate-900 truncate group-hover:text-[#606beb] transition-colors mt-0.5">
          {label}
        </h3>
        <p className="text-sm text-slate-500 truncate">{sub}</p>
      </div>
      <div className="flex flex-col items-end gap-2 shrink-0">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tone.bg} ${tone.text}`}>
          {score}/100
        </span>
        <span className="text-xs font-medium text-[#606beb] opacity-0 group-hover:opacity-100 transition-opacity">
          Open →
        </span>
      </div>
    </Link>
  );
};

export default ReviewCard;
