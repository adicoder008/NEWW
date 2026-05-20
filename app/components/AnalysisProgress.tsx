const steps = ["Extracting text", "Matching role", "Building report"];

const AnalysisProgress = ({ message }: { message: string }) => {
  const activeIndex = message.includes("Parsing")
    ? 0
    : message.includes("Matching")
      ? 1
      : 2;

  return (
    <div className="py-6 flex flex-col items-center text-center max-w-sm mx-auto">
      <div className="relative size-16 mb-6">
        <div className="absolute inset-0 rounded-full bg-[#f4f7fe]" />
        <div className="absolute inset-0 rounded-full border-2 border-[#606beb] border-t-transparent animate-spin" />
      </div>

      <p className="text-lg font-semibold text-gray-900">{message}</p>
      <p className="mt-2 text-sm text-dark-200">Typically 15–30 seconds — keep this tab open</p>

      <ul className="mt-8 w-full space-y-2 text-left">
        {steps.map((label, i) => (
          <li
            key={label}
            className={`flex items-center gap-3 text-sm rounded-xl px-4 py-3 transition-colors ${
              i <= activeIndex ? "bg-[#f4f7fe] text-gray-800" : "text-gray-400"
            }`}
          >
            <span
              className={`size-2.5 rounded-full shrink-0 ${
                i < activeIndex
                  ? "bg-[#606beb]"
                  : i === activeIndex
                    ? "bg-[#606beb] animate-pulse"
                    : "bg-gray-300"
              }`}
            />
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnalysisProgress;
