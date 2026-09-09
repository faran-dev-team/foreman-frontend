"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { AdminNav } from "@/components/admin/admin-nav";
import { fetchAuthMe, type AuthUser } from "@/lib/api/auth-login";
import {
  clearAdminTokens,
  getAdminAccessToken,
} from "@/lib/auth/admin-session";
import { ForemanLogo } from "@/lib/brand";

type AdminShellProps = {
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

function SidebarAdminCard() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const token = getAdminAccessToken();
    if (!token) return;
    void fetchAuthMe(token)
      .then((profile) => setUser(profile))
      .catch(() => setUser(null));
  }, []);

  const displayName = user?.full_name || "Super Admin";
  const email = user?.email || null;
  const initials = (displayName[0] || "A").toUpperCase();

  const signOut = () => {
    clearAdminTokens();
    router.replace("/admin/login");
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-sm font-semibold text-white">
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">{displayName}</p>
        {email ? (
          <p className="truncate text-xs text-foreman-muted">{email}</p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={signOut}
        className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-foreman-muted transition hover:bg-white/10 hover:text-white"
      >
        Sign out
      </button>
    </div>
  );
}

export function AdminShell({ children }: AdminShellProps) {
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
      {mobileNavOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-foreman-navy/50 lg:hidden"
          aria-label="Close navigation menu"
          onClick={closeMobileNav}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-64 max-w-[85vw] flex-col border-r border-white/10 bg-foreman-navy text-white transition-transform duration-200 ease-out lg:max-w-none lg:translate-x-0 ${
          mobileNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="shrink-0 border-b border-white/10 px-5 py-4 sm:px-6 sm:py-5">
          <Link
            href="/admin/owner-signups"
            className="flex items-center gap-3 rounded-lg outline-none ring-foreman-accent focus-visible:ring-2"
            onClick={closeMobileNav}
          >
            <ForemanLogo size={36} />
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-foreman-accent">
                Foreman
              </p>
              <h1 className="truncate text-base font-semibold tracking-tight">
                Super Admin
              </h1>
            </div>
          </Link>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <AdminNav onNavigate={closeMobileNav} />
        </div>

        <div className="shrink-0 border-t border-white/10 px-4 py-4">
          <SidebarAdminCard />
        </div>
      </aside>

      <div className="flex h-dvh min-w-0 flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex shrink-0 items-center gap-3 border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-8 lg:py-4">
          <button
            type="button"
            className="inline-flex rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 lg:hidden"
            aria-expanded={mobileNavOpen}
            aria-controls="admin-navigation"
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
              Super Admin
            </p>
            <p className="hidden min-w-0 truncate text-sm font-medium text-slate-700 sm:block">
              Foreman Super Admin
            </p>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
