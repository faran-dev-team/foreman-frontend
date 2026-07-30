'use client';

import Link from "next/link";

type AuthPageShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

function BackArrowIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );
}

export function AuthPageShell({ title, description, children }: AuthPageShellProps) {
  return (
    <main className="flex min-h-screen flex-col bg-slate-50 px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <Link
          href="/"
          className="mb-6 inline-flex w-fit items-center gap-2 rounded-lg px-1 py-1 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 sm:mb-8"
        >
          <BackArrowIcon />
          Back to Home
        </Link>

        <div className="mb-6 text-center sm:mb-8">
          <Link
            href="/"
            className="inline-block text-sm font-semibold uppercase tracking-widest text-amber-600 transition-opacity hover:opacity-80"
          >
            Foreman
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">{title}</h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">{description}</p>
        </div>

        <div className="w-full min-w-0 overflow-x-hidden">{children}</div>
      </div>
    </main>
  );
}
