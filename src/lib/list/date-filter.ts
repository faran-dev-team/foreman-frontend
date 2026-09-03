export type DateFilter = "all" | "today" | "week" | "month";

export const DATE_FILTER_OPTIONS: { value: DateFilter; label: string }[] = [
  { value: "all", label: "All time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
];

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfWeek(date: Date): Date {
  const d = startOfDay(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  return d;
}

function startOfMonth(date: Date): Date {
  const d = startOfDay(date);
  d.setDate(1);
  return d;
}

export function passesDateFilter(
  iso: string | null | undefined,
  filter: DateFilter,
): boolean {
  if (filter === "all") return true;
  if (!iso) return false;

  const valueDate = new Date(iso);
  if (Number.isNaN(valueDate.getTime())) return true;

  const now = new Date();
  if (filter === "today") return valueDate >= startOfDay(now);
  if (filter === "week") return valueDate >= startOfWeek(now);
  if (filter === "month") return valueDate >= startOfMonth(now);
  return true;
}
