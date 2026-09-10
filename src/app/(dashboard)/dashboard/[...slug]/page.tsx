import { notFound } from "next/navigation";

/** Unknown /dashboard/... paths render the dashboard 404 inside the owner shell. */
export default function UnmatchedDashboardSubpath() {
  notFound();
}
