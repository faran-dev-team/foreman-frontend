type RevenueCapturedCardProps = {
  amount?: number | null;
  jobCount?: number;
  loading?: boolean;
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function RevenueCapturedCard({
  amount,
  jobCount = 0,
  loading = false,
}: RevenueCapturedCardProps) {
  if (loading) {
    return (
      <div className="animate-pulse rounded-xl bg-foreman-navy px-5 py-6 shadow-sm sm:px-8 sm:py-8">
        <div className="h-4 w-32 rounded bg-slate-600" />
        <div className="mt-4 h-10 w-48 rounded bg-slate-600" />
        <div className="mt-3 h-4 w-64 rounded bg-slate-600" />
      </div>
    );
  }

  const displayAmount = amount ?? 0;

  return (
    <div className="rounded-xl bg-foreman-navy px-5 py-6 text-white shadow-sm sm:px-8 sm:py-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 sm:text-sm">
        Revenue Captured
      </p>
      <p className="mt-2 text-3xl font-bold tracking-tight sm:mt-3 sm:text-4xl">
        {formatCurrency(displayAmount)}
      </p>
      <p className="mt-2 text-sm text-slate-300">
        Estimated value from {jobCount} booked job{jobCount === 1 ? "" : "s"}{" "}
        in this period
      </p>
    </div>
  );
}
