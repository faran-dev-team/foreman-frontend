"use client";

import { useAuth } from "@clerk/nextjs";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { useShopQueryEnabled } from "@/hooks/use-shop-query-enabled";
import {
  fetchOnboardingStatus,
  type OnboardingStatus,
} from "@/lib/api/onboarding";
import { fetchShopSettings } from "@/lib/api/settings";
import { withClerkAuthRetry } from "@/lib/auth/clerk-token";
import { QUERY_STALE_MS } from "@/lib/query/config";
import { queryKeys } from "@/lib/query/keys";
import type { ShopSettingsForm } from "@/lib/settings/types";

export type OnboardingPageData = {
  status: OnboardingStatus;
  settings: ShopSettingsForm;
};

export function useOnboardingQuery() {
  const { getToken } = useAuth();
  const { enabled, shopId } = useShopQueryEnabled();

  return useQuery({
    queryKey: queryKeys.onboarding(shopId ?? ""),
    queryFn: (): Promise<OnboardingPageData> =>
      withClerkAuthRetry(getToken, async (token) => {
        const [status, settings] = await Promise.all([
          fetchOnboardingStatus(shopId!, token),
          fetchShopSettings(shopId!, token),
        ]);
        return { status, settings };
      }),
    enabled: enabled && Boolean(shopId),
    staleTime: QUERY_STALE_MS,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
}
