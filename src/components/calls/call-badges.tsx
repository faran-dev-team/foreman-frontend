import type { CallIntent, CallOutcome } from "@/lib/api/types";

const intentStyles: Record<string, string> = {
  booking: "bg-blue-100 text-blue-800",
  quote: "bg-violet-100 text-violet-800",
  question: "bg-slate-100 text-slate-700",
  wrong_number: "bg-slate-100 text-slate-500",
  other: "bg-slate-100 text-slate-600",
};

const outcomeStyles: Record<string, string> = {
  booked: "bg-emerald-100 text-emerald-800",
  not_booked: "bg-amber-100 text-amber-800",
  escalated: "bg-orange-100 text-orange-800",
  missed: "bg-red-100 text-red-800",
};

function formatLabel(value: string): string {
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

type BadgeProps = {
  value?: string | null;
  styles: Record<string, string>;
};

function Badge({ value, styles }: BadgeProps) {
  if (!value) {
    return <span className="text-sm text-slate-400">—</span>;
  }

  const key = value.toLowerCase();
  const className = styles[key] ?? "bg-slate-100 text-slate-600";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      {formatLabel(value)}
    </span>
  );
}

export function IntentBadge({ intent }: { intent?: CallIntent | string | null }) {
  return <Badge value={intent} styles={intentStyles} />;
}

export function OutcomeBadge({
  outcome,
}: {
  outcome?: CallOutcome | string | null;
}) {
  return <Badge value={outcome} styles={outcomeStyles} />;
}
