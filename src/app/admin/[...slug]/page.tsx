import { notFound } from "next/navigation";

/** Unknown /admin/* paths (except login and console routes). */
export default function UnmatchedAdminPath() {
  notFound();
}
