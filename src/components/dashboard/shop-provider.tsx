"use client";

import { useAuth } from "@clerk/nextjs";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { ApiError } from "@/lib/api/client";
import { getDefaultShopId } from "@/lib/api/config";
import { fetchDashboardMe, type DashboardMe } from "@/lib/api/me";
import { waitForClerkToken } from "@/lib/auth/clerk-token";

type ShopContextValue = {
  shopId: string | undefined;
  shopName: string | undefined;
  role: string | undefined;
  /** True while Clerk is loading or the first /dashboard/me resolve is in flight. */
  loading: boolean;
  /** True while /me is resolving — owner API calls should wait to avoid 403 flash. */
  resolvingMe: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const ShopContext = createContext<ShopContextValue | null>(null);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const envShopId = getDefaultShopId();

  const [me, setMe] = useState<DashboardMe | null>(null);
  // Start true so dashboard APIs wait until the first /me attempt finishes.
  // Otherwise env shopId fires analytics before membership is ready → 403 flash.
  const [resolvingMe, setResolvingMe] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!isLoaded) {
      setResolvingMe(true);
      return;
    }

    if (!isSignedIn) {
      setMe(null);
      setError(null);
      setResolvingMe(false);
      return;
    }

    setResolvingMe(true);
    setError(null);

    try {
      const token = await waitForClerkToken(getToken);
      if (!token) {
        setError("Authentication required.");
        return;
      }
      const result = await fetchDashboardMe(token);
      setMe(result);
    } catch (err) {
      // Keep env shop fallback — don't wipe shopId on transient /me failures.
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof TypeError) {
        setError("Cannot reach the Foreman API.");
      } else {
        setError("Failed to resolve shop for this account.");
      }
    } finally {
      setResolvingMe(false);
    }
  }, [getToken, isLoaded, isSignedIn]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const shopId = me?.shop_id || envShopId;

  const value = useMemo<ShopContextValue>(
    () => ({
      shopId,
      shopName: me?.shop_name,
      role: me?.role,
      // Block owner pages until Clerk is ready and first /me attempt finishes.
      loading: !isLoaded || (isSignedIn && resolvingMe),
      resolvingMe,
      error,
      refresh,
    }),
    [shopId, me, isLoaded, isSignedIn, resolvingMe, error, refresh],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop(): ShopContextValue {
  const ctx = useContext(ShopContext);
  if (!ctx) {
    throw new Error("useShop must be used within ShopProvider");
  }
  return ctx;
}
