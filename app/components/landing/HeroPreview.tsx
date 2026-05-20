const MiniBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-[11px]">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-800">{value}</span>
    </div>
    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
      <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
    </div>
  </div>
);

const HeroPreview = () => (
  <div className="land-preview relative w-full max-w-[520px] mx-auto lg:mx-0 lg:ml-auto">
    <div className="land-preview-glow" aria-hidden />
    <div className="land-preview-glow land-preview-glow--2" aria-hidden />

    <div className="gradient-border relative z-0">
      <div className="land-glass rounded-xl p-4 sm:p-5 shadow-[0_32px_64px_-24px_rgba(96,107,235,0.45)] border border-white/80">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#606beb]">
              Live analysis
            </p>
            <p className="text-sm font-semibold text-slate-900 mt-0.5">
              Product Designer · Stripe
            </p>
          </div>
          <span className="land-badge-green text-[11px] font-semibold px-2.5 py-1 rounded-full">
            Complete
          </span>
        </div>

        <div className="grid grid-cols-[1fr_auto] gap-4 items-center mb-5">
          <div>
            <p className="text-xs text-slate-500 mb-1">Overall fit</p>
            <p className="text-4xl font-bold tracking-tight text-slate-900">
              84<span className="text-lg font-medium text-slate-400">/100</span>
            </p>
          </div>
          <div className="relative size-20">
            <svg className="size-full -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="#e8ecf8" strokeWidth="6" />
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke="url(#heroGrad)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="213.6"
                strokeDashoffset="34"
              />
              <defs>
                <linearGradient id="heroGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#8e98ff" />
                  <stop offset="100%" stopColor="#606beb" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-800">
              84
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <MiniBar label="ATS compatibility" value={91} color="#606beb" />
          <MiniBar label="Job match" value={78} color="#8e98ff" />
          <MiniBar label="Skills alignment" value={72} color="#a78bfa" />
        </div>
      </div>
    </div>

    <div className="absolute -top-3 -right-2 sm:-right-6 land-float-a land-glass rounded-xl px-3 py-2.5 shadow-lg border border-white/90 max-w-[140px] z-10">
      <p className="text-[10px] text-slate-500 font-medium">ATS score</p>
      <p className="text-xl font-bold text-[#606beb]">91</p>
    </div>

    <div className="absolute -bottom-4 -left-2 sm:-left-6 land-float-b land-glass rounded-xl px-3 py-2.5 shadow-lg border border-white/90 max-w-[160px] z-10">
      <p className="text-[10px] text-slate-500 font-medium">Missing skills</p>
      <p className="text-xs font-semibold text-slate-800 mt-1">Figma · Design systems</p>
    </div>

    <div className="absolute top-1/2 -right-4 sm:-right-8 land-float-c hidden sm:block land-glass rounded-lg px-2.5 py-2 shadow-md border border-white/80 z-10">
      <div className="flex items-center gap-1.5">
        <img src="/icons/check.svg" alt="" className="size-3.5" />
        <span className="text-[11px] font-medium text-slate-700">3 quick wins</span>
      </div>
    </div>
  </div>
);

export default HeroPreview;
