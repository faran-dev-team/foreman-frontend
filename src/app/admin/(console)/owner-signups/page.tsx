"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import {
  approveOwnerSignup,
  bulkRejectOwnerSignups,
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

function isLikelyTestEmail(email: string): boolean {
  const lower = email.toLowerCase();
  return (
    lower.endsWith("@example.com") ||
    lower.endsWith("@users.foreman.local") ||
    lower.startsWith("missing-internal@")
  );
}

export default function OwnerSignupsPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [items, setItems] = useState<OwnerSignupItem[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const load = async (token: string) => {
    const data = await fetchOwnerSignups(token, "pending");
    setItems(data.items);
    setTotal(data.total);
    setSelected({});
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

  const selectedIds = useMemo(
    () => Object.keys(selected).filter((id) => selected[id]),
    [selected],
  );

  const runAction = async (userId: string, action: "approve" | "reject") => {
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

  const runBulkReject = async (rejectAll: boolean) => {
    const token = getAdminAccessToken();
    if (!token) return;
    const confirmMessage = rejectAll
      ? `Reject all ${total} pending signup(s)? Real owners in this queue will need to sign up again.`
      : `Reject ${selectedIds.length} selected signup(s)?`;
    if (!window.confirm(confirmMessage)) return;

    setBulkBusy(true);
    setError(null);
    setNotice(null);
    try {
      const result = await bulkRejectOwnerSignups(
        token,
        rejectAll
          ? { reject_all_pending: true }
          : { user_ids: selectedIds },
      );
      setNotice(result.message);
      await load(token);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Bulk reject failed.");
    } finally {
      setBulkBusy(false);
    }
  };

  const toggleAll = (checked: boolean) => {
    if (!checked) {
      setSelected({});
      return;
    }
    const next: Record<string, boolean> = {};
    for (const item of items) {
      next[item.user_id] = true;
    }
    setSelected(next);
  };

  if (!ready) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-600">
        Loading Super Admin…
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Pending owner signups</h1>
        <p className="mt-1 text-sm text-slate-600">
          Newest first. Approve to create a new shop UUID. Test emails
          (@example.com) usually come from local pytest runs against this
          database — reject those, do not approve them.
        </p>
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
        <>
          <div className="mt-6 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={items.length > 0 && selectedIds.length === items.length}
                onChange={(event) => toggleAll(event.target.checked)}
              />
              Select all on this page ({selectedIds.length} selected · {total}{" "}
              pending)
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                disabled={bulkBusy || selectedIds.length === 0}
                onClick={() => void runBulkReject(false)}
                className="rounded-lg border border-red-300 px-3 py-2 text-sm font-semibold text-red-800 hover:bg-red-50 disabled:opacity-50"
              >
                Reject selected
              </button>
              <button
                type="button"
                disabled={bulkBusy}
                onClick={() => void runBulkReject(true)}
                className="rounded-lg bg-red-800 px-3 py-2 text-sm font-semibold text-white hover:bg-red-900 disabled:opacity-50"
              >
                Reject all pending
              </button>
            </div>
          </div>
          <ul className="mt-3 space-y-3">
            {items.map((item) => (
              <li
                key={item.user_id}
                className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1 shrink-0"
                    checked={Boolean(selected[item.user_id])}
                    onChange={(event) =>
                      setSelected((current) => ({
                        ...current,
                        [item.user_id]: event.target.checked,
                      }))
                    }
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">
                      {item.full_name}
                      {isLikelyTestEmail(item.email) ? (
                        <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                          test
                        </span>
                      ) : null}
                    </p>
                    <p className="break-all text-sm text-slate-600">{item.email}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Requested {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex w-full gap-2 lg:w-auto">
                  <button
                    type="button"
                    disabled={busyId === item.user_id || bulkBusy}
                    onClick={() => void runAction(item.user_id, "approve")}
                    className="flex-1 rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50 lg:flex-none"
                  >
                    {busyId === item.user_id ? "Working…" : "Approve"}
                  </button>
                  <button
                    type="button"
                    disabled={busyId === item.user_id || bulkBusy}
                    onClick={() => void runAction(item.user_id, "reject")}
                    className="flex-1 rounded-lg border border-red-300 px-3 py-2 text-sm font-semibold text-red-800 hover:bg-red-50 disabled:opacity-50 lg:flex-none"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
