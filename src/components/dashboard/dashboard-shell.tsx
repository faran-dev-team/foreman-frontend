"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { DashboardMain } from "@/components/dashboard/dashboard-main";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";

type DashboardShellProps = {
  children: React.ReactNode;
};

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      {open ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 6h16M4 12h16M4 18h16"
        />
      )}
    </svg>
  );
}

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const closeMobileNav = useCallback(() => {
    setMobileNavOpen(false);
  }, []);

  useEffect(() => {
    closeMobileNav();
  }, [pathname, closeMobileNav]);

  useEffect(() => {
    if (!mobileNavOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMobileNav();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileNavOpen, closeMobileNav]);

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      {mobileNavOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          aria-label="Close navigation menu"
          onClick={closeMobileNav}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 max-w-[85vw] flex-col border-r border-slate-200 bg-foreman-navy text-white transition-transform duration-200 ease-out lg:static lg:z-auto lg:max-w-none lg:translate-x-0 ${
          mobileNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-slate-700 px-5 py-4 sm:px-6 sm:py-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">
            Foreman
          </p>
          <h1 className="mt-1 text-lg font-semibold">Owner Dashboard</h1>
        </div>

        <DashboardNav onNavigate={closeMobileNav} />

        <div className="border-t border-slate-700 px-4 py-4">
          <UserButton
            afterSignOutUrl="/sign-in"
            appearance={{
              elements: {
                avatarBox: "h-9 w-9",
              },
            }}
          />
        </div>
      </aside>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:px-6 lg:px-8 lg:py-4">
          <button
            type="button"
            className="inline-flex rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 lg:hidden"
            aria-expanded={mobileNavOpen}
            aria-controls="dashboard-navigation"
            onClick={() => setMobileNavOpen((open) => !open)}
          >
            <span className="sr-only">
              {mobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
            </span>
            <MenuIcon open={mobileNavOpen} />
          </button>
          <p className="min-w-0 truncate text-sm text-slate-500">
            Foreman MVP · Owner portal
          </p>
        </header>

        <DashboardMain>{children}</DashboardMain>
      </div>
    </div>
  );
}
