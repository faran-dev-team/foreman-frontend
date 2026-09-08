"use client";

import { useShop } from "@/components/dashboard/shop-provider";

export function OwnerAccessGate({ children }: { children: React.ReactNode }) {
  const { loading, accountStatus, accountMessage } = useShop();

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-40 animate-pulse rounded-xl bg-slate-200" />
      </div>
    );
  }

  if (accountStatus === "pending") {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-amber-200 bg-amber-50 px-6 py-8 text-center">
        <h2 className="text-lg font-semibold text-amber-950">
          Approval pending on Super Admin
        </h2>
        <p className="mt-2 text-sm text-amber-900/90">
          {accountMessage ||
            "You will be notified shortly. You cannot use the owner dashboard until an administrator approves your signup."}
        </p>
      </div>
    );
  }

  if (accountStatus === "rejected") {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center">
        <h2 className="text-lg font-semibold text-red-900">Signup not approved</h2>
        <p className="mt-2 text-sm text-red-800">
          {accountMessage ||
            "Your signup was not approved. Contact Foreman support if you think this is a mistake."}
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
