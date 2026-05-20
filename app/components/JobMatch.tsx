import ScoreBadge from "./ScoreBadge";

const JobMatch = ({ feedback }: { feedback: Feedback }) => {
  if (!feedback.jobMatch && !feedback.skillsGap && !feedback.improvements?.length) {
    return null;
  }

  return (
    <section className="bg-white rounded-2xl shadow-md w-full p-6 flex flex-col gap-6 animate-in fade-in duration-700">
      {feedback.jobMatch && (
        <div>
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-gray-900">Role fit</h2>
            <ScoreBadge score={feedback.jobMatch.score} />
          </div>
          <p className="mt-3 text-gray-600 leading-relaxed">{feedback.jobMatch.summary}</p>
        </div>
      )}

      {feedback.skillsGap && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills gap</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-green-200 bg-green-50/80 p-4">
              <p className="text-sm font-medium text-green-800 mb-2">Aligned</p>
              <ul className="space-y-1.5 text-sm text-green-900">
                {feedback.skillsGap.matched.length > 0 ? (
                  feedback.skillsGap.matched.map((s) => (
                    <li key={s} className="flex gap-2">
                      <span className="text-green-600">•</span>
                      {s}
                    </li>
                  ))
                ) : (
                  <li className="text-green-800/70">None highlighted</li>
                )}
              </ul>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4">
              <p className="text-sm font-medium text-amber-800 mb-2">To strengthen</p>
              <ul className="space-y-1.5 text-sm text-amber-900">
                {feedback.skillsGap.missing.length > 0 ? (
                  feedback.skillsGap.missing.map((s) => (
                    <li key={s} className="flex gap-2">
                      <span className="text-amber-600">•</span>
                      {s}
                    </li>
                  ))
                ) : (
                  <li className="text-amber-800/70">No major gaps flagged</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {feedback.improvements && feedback.improvements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Priority fixes</h3>
          <ul className="list-disc list-inside space-y-1.5 text-gray-600">
            {feedback.improvements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default JobMatch;
