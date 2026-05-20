import { cn } from "~/lib/utils";

type NoticeVariant = "error" | "warning" | "info";

const styles: Record<NoticeVariant, { box: string; title: string; icon: string }> = {
  error: {
    box: "border-[#e8c4c2] bg-[#fdf6f5]",
    title: "text-[#752522]",
    icon: "/icons/warning.svg",
  },
  warning: {
    box: "border-[#ecd9b8] bg-[#fefaf3]",
    title: "text-[#73321b]",
    icon: "/icons/warning.svg",
  },
  info: {
    box: "border-[#c1d3f8] bg-[#f4f7fe]",
    title: "text-[#3d4a6e]",
    icon: "/icons/info.svg",
  },
};

type NoticeProps = {
  title: string;
  message: string;
  hint?: string;
  variant?: NoticeVariant;
  onDismiss?: () => void;
  action?: { label: string; onClick: () => void };
};

const Notice = ({
  title,
  message,
  hint,
  variant = "error",
  onDismiss,
  action,
}: NoticeProps) => {
  const s = styles[variant];

  return (
    <div
      role="alert"
      className={cn("rounded-2xl border px-5 py-4 flex gap-4", s.box)}
    >
      <img src={s.icon} alt="" className="size-5 mt-0.5 shrink-0 opacity-80" />
      <div className="flex-1 min-w-0">
        <p className={cn("font-semibold text-[15px]", s.title)}>{title}</p>
        <p className="mt-1 text-sm text-dark-200 leading-relaxed">{message}</p>
        {hint && <p className="mt-2 text-xs text-dark-200/80">{hint}</p>}
        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className="mt-3 text-sm font-medium text-[#606beb] hover:text-[#4957eb] underline-offset-2 hover:underline"
          >
            {action.label}
          </button>
        )}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 p-1 opacity-50 hover:opacity-100"
          aria-label="Dismiss"
        >
          <img src="/icons/cross.svg" alt="" className="size-4" />
        </button>
      )}
    </div>
  );
};

export default Notice;
