const statusStyles: Record<string, string> = {
  booked: "bg-emerald-100 text-emerald-800",
  confirmed: "bg-emerald-100 text-emerald-800",
  completed: "bg-blue-100 text-blue-800",
  in_progress: "bg-violet-100 text-violet-800",
  pending: "bg-amber-100 text-amber-800",
  cancelled: "bg-slate-100 text-slate-600",
  no_show: "bg-red-100 text-red-800",
};

function formatLabel(value: string): string {
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function JobStatusBadge({ status }: { status?: string | null }) {
  if (!status) {
    return <span className="text-sm text-slate-400">—</span>;
  }

  const key = status.toLowerCase();
  const className = statusStyles[key] ?? "bg-slate-100 text-slate-600";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      {formatLabel(status)}
    </span>
  );
}
