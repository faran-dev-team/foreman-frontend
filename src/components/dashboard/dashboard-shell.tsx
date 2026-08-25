"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { DashboardMain } from "@/components/dashboard/dashboard-main";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { ForemanLogo } from "@/lib/brand";

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

function SidebarUserCard() {
  const { signOut } = useClerk();
  const { user, isLoaded } = useUser();
  const [signingOut, setSigningOut] = useState(false);

  const displayName =
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.username ||
    "Account";
  const email =
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress ||
    null;
  const initials =
    (user?.firstName?.[0] || user?.fullName?.[0] || user?.username?.[0] || "A").toUpperCase();

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut({ redirectUrl: "/sign-in" });
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-sm font-semibold text-white">
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        {!isLoaded ? (
          <div className="space-y-1.5">
            <div className="h-3.5 w-24 animate-pulse rounded bg-white/10" />
            <div className="h-3 w-32 animate-pulse rounded bg-white/10" />
          </div>
        ) : (
          <>
            <p className="truncate text-sm font-medium text-white">{displayName}</p>
            {email ? (
              <p className="truncate text-xs text-foreman-muted">{email}</p>
            ) : null}
          </>
        )}
      </div>
      <button
        type="button"
        onClick={() => void handleSignOut()}
        disabled={signingOut}
        className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-foreman-muted transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {signingOut ? "Signing out..." : "Sign out"}
      </button>
    </div>
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
    <div className="h-dvh overflow-hidden bg-[#F4F6F9] font-sans">
      {mobileNavOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-foreman-navy/50 lg:hidden"
          aria-label="Close navigation menu"
          onClick={closeMobileNav}
        />
      )}

      {/* Fixed viewport sidebar — never scrolls with page content */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-64 max-w-[85vw] flex-col border-r border-white/10 bg-foreman-navy text-white transition-transform duration-200 ease-out lg:max-w-none lg:translate-x-0 ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="shrink-0 border-b border-white/10 px-5 py-4 sm:px-6 sm:py-5">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-lg outline-none ring-foreman-accent focus-visible:ring-2"
            onClick={closeMobileNav}
          >
            <ForemanLogo size={36} />
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-foreman-accent">
                Foreman
              </p>
              <h1 className="truncate text-base font-semibold tracking-tight">
                Owner Dashboard
              </h1>
            </div>
          </Link>
        </div>

        {/* Nav scrolls internally if links exceed height */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain lg:overflow-y-visible">
          <DashboardNav onNavigate={closeMobileNav} />
        </div>

        <div className="shrink-0 border-t border-white/10 px-4 py-4">
          <SidebarUserCard />
        </div>
      </aside>

      {/* Main column offset for fixed sidebar; only this region scrolls */}
      <div className="flex h-dvh min-w-0 flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex shrink-0 items-center gap-3 border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-8 lg:py-4">
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
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <ForemanLogo size={22} className="hidden sm:block" />
            <p className="min-w-0 truncate text-sm font-medium text-slate-700 sm:hidden">
              Owner portal
            </p>
            <p className="hidden min-w-0 truncate text-sm font-medium text-slate-700 sm:block">
              Foreman Owner portal
            </p>
          </div>
          <NotificationBell />
        </header>

        <DashboardMain>{children}</DashboardMain>
      </div>
    </div>
  );
}
