"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/calls", label: "Calls" },
  { href: "/live-transcript", label: "Live Transcript" },
  { href: "/jobs", label: "Jobs" },
  { href: "/reports", label: "Reports" },
  { href: "/reviews", label: "Reviews" },
  { href: "/reminders", label: "Reminders" },
  { href: "/follow-ups", label: "Follow-ups" },
  { href: "/settings", label: "Settings" },
] as const;

type DashboardNavProps = {
  onNavigate?: () => void;
};

export function DashboardNav({ onNavigate }: DashboardNavProps) {
  const pathname = usePathname();

  return (
    <nav
      id="dashboard-navigation"
      className="space-y-1 px-3 py-4"
      aria-label="Dashboard"
    >
      {navItems.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
              isActive
                ? "bg-foreman-accent/15 text-white ring-1 ring-inset ring-foreman-accent/40"
                : "text-foreman-muted hover:bg-white/5 hover:text-white"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
