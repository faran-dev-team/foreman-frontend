"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin/owner-signups", label: "Owner signups", enabled: true },
  { href: "/admin/shops", label: "Shops", enabled: false },
  { href: "/admin/operators", label: "Operators", enabled: false },
  { href: "/admin/audit", label: "Audit log", enabled: false },
] as const;

type AdminNavProps = {
  onNavigate?: () => void;
};

export function AdminNav({ onNavigate }: AdminNavProps) {
  const pathname = usePathname();

  return (
    <nav
      id="admin-navigation"
      className="space-y-1 px-3 py-4"
      aria-label="Super Admin"
    >
      {navItems.map((item) => {
        const isActive =
          item.enabled &&
          (pathname === item.href || pathname.startsWith(`${item.href}/`));

        if (!item.enabled) {
          return (
            <span
              key={item.href}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-white/35"
            >
              {item.label}
              <span className="text-[10px] font-semibold uppercase tracking-wide text-white/30">
                Soon
              </span>
            </span>
          );
        }

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
