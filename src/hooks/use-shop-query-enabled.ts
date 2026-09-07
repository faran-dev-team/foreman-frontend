"use client";

import { useAuth } from "@clerk/nextjs";

import { useShop } from "@/components/dashboard/shop-provider";

export function useShopQueryEnabled(): {
  enabled: boolean;
  shopId: string | undefined;
} {
  const { isLoaded, isSignedIn } = useAuth();
  const { shopId, loading, resolvingMe } = useShop();

  const enabled =
    isLoaded &&
    isSignedIn === true &&
    !loading &&
    !resolvingMe &&
    Boolean(shopId);

  return { enabled, shopId };
}
