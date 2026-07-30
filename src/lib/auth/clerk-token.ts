import { ApiError } from "@/lib/api/client";

type GetToken = () => Promise<string | null>;

/**
 * Wait briefly for Clerk to expose a session JWT after sign-in redirect.
 * Avoids firing dashboard API calls with a missing Bearer token.
 */
export async function waitForClerkToken(
  getToken: GetToken,
  options?: { attempts?: number; delayMs?: number },
): Promise<string | null> {
  const attempts = options?.attempts ?? 8;
  const delayMs = options?.delayMs ?? 150;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const token = await getToken();
    if (token) {
      return token;
    }
    if (attempt < attempts - 1) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return null;
}

export function isAuthRequiredError(error: unknown): boolean {
  return (
    error instanceof ApiError &&
    (error.status === 401 || error.status === 403)
  );
}

/**
 * Run an authenticated API call; soft-retry on early 401/403 while Clerk/session settles.
 */
export async function withClerkAuthRetry<T>(
  getToken: GetToken,
  run: (token: string) => Promise<T>,
): Promise<T> {
  const token = await waitForClerkToken(getToken);
  if (!token) {
    throw new ApiError(401, "Authentication required.");
  }

  let lastError: unknown;
  const maxAttempts = 3;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      const attemptToken =
        attempt === 0
          ? token
          : (await waitForClerkToken(getToken, {
              attempts: 6,
              delayMs: 150,
            })) ?? token;
      return await run(attemptToken);
    } catch (error) {
      lastError = error;
      if (!isAuthRequiredError(error) || attempt === maxAttempts - 1) {
        throw error;
      }
      // Token/membership may still be settling after sign-in redirect.
      await new Promise((resolve) =>
        setTimeout(resolve, 300 * (attempt + 1)),
      );
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new ApiError(401, "Authentication required.");
}
