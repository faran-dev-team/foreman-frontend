"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { getAdminAccessToken } from "@/lib/auth/admin-session";
import { ForemanLogo } from "@/lib/brand";

type NotFoundViewProps = {
  /** When true, skip full-viewport chrome (already inside dashboard/admin shell). */
  embedded?: boolean;
};

export function NotFoundView({ embedded = false }: NotFoundViewProps) {
  const pathname = usePathname();
  const { isLoaded, isSignedIn } = useAuth();
  const [adminSession, setAdminSession] = useState(false);

  useEffect(() => {
    setAdminSession(Boolean(getAdminAccessToken()));
  }, []);

  const isAdminPath = pathname.startsWith("/admin");
  const isOwnerAppPath =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/calls") ||
    pathname.startsWith("/live-transcript") ||
    pathname.startsWith("/jobs") ||
    pathname.startsWith("/reports") ||
    pathname.startsWith("/reviews") ||
    pathname.startsWith("/reminders") ||
    pathname.startsWith("/follow-ups") ||
    pathname.startsWith("/settings");

  const showOwnerCta = Boolean(isSignedIn) || isOwnerAppPath;
  const showAdminCta = isAdminPath || adminSession;

  const primaryHref = isAdminPath
    ? adminSession
      ? "/admin/owner-signups"
      : "/admin/login"
    : showOwnerCta
      ? "/dashboard"
      : "/";
  const primaryLabel = isAdminPath
    ? adminSession
      ? "Back to Super Admin"
      : "Super Admin sign in"
    : showOwnerCta
      ? "Back to dashboard"
      : "Back to home";

  const inner = (
    <div className="mx-auto w-full max-w-lg px-4 py-10 sm:py-14">
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm sm:px-10">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg outline-none ring-foreman-accent focus-visible:ring-2"
        >
          <ForemanLogo size={40} />
          <span className="sr-only">Foreman home</span>
        </Link>
        <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-amber-600">
          Foreman
        </p>
        <p className="mt-3 text-5xl font-bold tabular-nums text-slate-900">404</p>
        <h1 className="mt-3 text-xl font-semibold text-slate-900 sm:text-2xl">
          This page could not be found
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          That link does not match a Foreman page. Check the URL, or use a
          button below to get back to a working screen.
        </p>
        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            href={primaryHref}
            className="inline-flex items-center justify-center rounded-lg bg-foreman-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {primaryLabel}
          </Link>
          {showOwnerCta && primaryHref !== "/" ? (
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Foreman home
            </Link>
          ) : null}
          {!isSignedIn && !isAdminPath ? (
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Owner sign in
            </Link>
          ) : null}
        </div>
        {!isLoaded ? (
          <p className="mt-6 text-xs text-slate-400">Checking your session…</p>
        ) : null}
      </div>
    </div>
  );

  if (embedded) {
    return inner;
  }

  return (
    <main className="flex min-h-dvh flex-col bg-[#F4F6F9]">{inner}</main>
  );
}
