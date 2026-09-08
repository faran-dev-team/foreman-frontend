"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  approveOwnerSignup,
  fetchOwnerSignups,
  rejectOwnerSignup,
  type OwnerSignupItem,
} from "@/lib/api/admin-owner-signups";
import { ApiError } from "@/lib/api/client";
import { fetchAuthMe } from "@/lib/api/auth-login";
import {
  clearAdminTokens,
  getAdminAccessToken,
} from "@/lib/auth/admin-session";

export default function OwnerSignupsPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [items, setItems] = useState<OwnerSignupItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const load = async (token: string) => {
    const data = await fetchOwnerSignups(token, "pending");
    setItems(data.items);
  };

  useEffect(() => {
    const token = getAdminAccessToken();
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    void (async () => {
      try {
        const me = await fetchAuthMe(token);
        if (me.role.toLowerCase() !== "admin") {
          clearAdminTokens();
          router.replace("/admin/login");
          return;
        }
        await load(token);
        setReady(true);
      } catch {
        clearAdminTokens();
        router.replace("/admin/login");
      }
    })();
  }, [router]);

  const runAction = async (
    userId: string,
    action: "approve" | "reject",
  ) => {
    const token = getAdminAccessToken();
    if (!token) return;
    setBusyId(userId);
    setError(null);
    setNotice(null);
    try {
      const result =
        action === "approve"
          ? await approveOwnerSignup(token, userId)
          : await rejectOwnerSignup(token, userId);
      setNotice(result.message);
      await load(token);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Action failed.");
    } finally {
      setBusyId(null);
    }
  };

  const signOut = () => {
    clearAdminTokens();
    router.replace("/admin/login");
  };

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-600">
        Loading Super Admin…
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-700">
              Foreman Super Admin
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Pending owner signups
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Approve to create a new shop UUID and email the owner.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
            >
              Home
            </Link>
            <button
              type="button"
              onClick={signOut}
              className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-white"
            >
              Sign out
            </button>
          </div>
        </div>

        {error ? (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        ) : null}
        {notice ? (
          <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            {notice}
          </p>
        ) : null}

        {items.length === 0 ? (
          <p className="mt-8 rounded-xl border border-slate-200 bg-white px-5 py-8 text-center text-sm text-slate-600">
            No pending signups.
          </p>
        ) : (
          <ul className="mt-6 space-y-3">
            {items.map((item) => (
              <li
                key={item.user_id}
                className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-slate-900">{item.full_name}</p>
                  <p className="text-sm text-slate-600">{item.email}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Requested {new Date(item.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={busyId === item.user_id}
                    onClick={() => void runAction(item.user_id, "approve")}
                    className="rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
                  >
                    {busyId === item.user_id ? "Working…" : "Approve"}
                  </button>
                  <button
                    type="button"
                    disabled={busyId === item.user_id}
                    onClick={() => void runAction(item.user_id, "reject")}
                    className="rounded-lg border border-red-300 px-3 py-2 text-sm font-semibold text-red-800 hover:bg-red-50 disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
