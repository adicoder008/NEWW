import { Link } from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import type { AnalysisSummary } from "~/lib/api";

const ResumeCard = ({ summary }: { summary: AnalysisSummary }) => {
  const score = summary.overallScore ?? 0;
  const label = summary.companyName || summary.fileName;
  const sub = summary.jobTitle || "General review";
  const date = new Date(summary.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  const scoreColor =
    score > 69 ? "text-[#254d4a]" : score > 49 ? "text-[#73321b]" : "text-[#752522]";

  return (
    <Link
      to={`/resume/${summary.id}`}
      className="group flex flex-col gap-5 rounded-2xl bg-white border border-gray-100 p-5 shadow-sm hover:shadow-lg hover:border-[#a7bff1] transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-[#606beb] uppercase tracking-wide mb-1">
            {date}
          </p>
          <h2 className="text-lg font-bold text-gray-900 truncate group-hover:text-[#606beb] transition-colors">
            {label}
          </h2>
          <p className="text-sm text-dark-200 truncate mt-0.5">{sub}</p>
        </div>
        <ScoreCircle score={score} />
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className={`text-sm font-semibold ${scoreColor}`}>
          Overall {score}/100
        </span>
        <span className="text-sm font-medium text-[#606beb] group-hover:translate-x-0.5 transition-transform">
          View report →
        </span>
      </div>
    </Link>
  );
};

export default ResumeCard;
