type DashboardPageHeroProps = {
  title: string;
  lead: string;
  support: string;
};

export function DashboardPageHero({
  title,
  lead,
  support,
}: DashboardPageHeroProps) {
  return (
    <div>
      <h2 className="text-xl font-bold text-foreman-navy sm:text-2xl">
        {title}
      </h2>
      <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
        {lead}
      </p>
      <p className="mt-1 text-sm text-foreman-navy/80 sm:text-base">{support}</p>
    </div>
  );
}
