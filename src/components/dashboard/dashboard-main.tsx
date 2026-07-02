"use client";

import { usePathname } from "next/navigation";

type DashboardMainProps = {
  children: React.ReactNode;
};

/** Remount page content on route change so Calls/Jobs/Settings never share stale UI. */
export function DashboardMain({ children }: DashboardMainProps) {
  const pathname = usePathname();

  return (
    <main
      key={pathname}
      className="flex-1 px-4 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-8"
    >
      {children}
    </main>
  );
}
