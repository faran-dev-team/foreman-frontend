"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { fetchAuthMe, loginWithPassword } from "@/lib/api/auth-login";
import { ApiError } from "@/lib/api/client";
import { setAdminTokens } from "@/lib/auth/admin-session";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const tokens = await loginWithPassword(email.trim(), password);
      const me = await fetchAuthMe(tokens.access_token);
      if (me.role.toLowerCase() !== "admin") {
        setError("This account is not a Super Admin.");
        return;
      }
      setAdminTokens(tokens.access_token, tokens.refresh_token);
      router.replace("/admin/owner-signups");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not reach the Foreman API. Confirm the backend is healthy on port 8000.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthPageShell
      title="Super Admin sign in"
      description="Approve new shop owners. This is not the owner dashboard login."
    >
      <form
        onSubmit={(event) => void onSubmit(event)}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <label className="block text-sm font-medium text-slate-700">
          Email
          <input
            type="text"
            inputMode="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Password
          <input
            type="password"
            autoComplete="current-password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
          />
        </label>
        {error ? (
          <p className="text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-foreman-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthPageShell>
  );
}
