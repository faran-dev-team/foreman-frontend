import type { CallListItem, JobListItem } from "@/lib/api/types";

const ACTIVE_JOB_STATUSES = new Set([
  "pending",
  "confirmed",
  "in_progress",
  "completed",
]);

function phoneDigits(value?: string | null): string | null {
  const digits = (value ?? "").replace(/\D/g, "");
  if (digits.length < 7) {
    return null;
  }
  return digits.slice(-10);
}

function normalizeName(value?: string | null): string | null {
  const text = value?.trim().toLowerCase();
  return text || null;
}

/**
 * When the calls API cannot link a row to its job (missing/stale call_id),
 * infer "booked" from confirmed jobs on the jobs feed (phone or customer name).
 */
export function enrichCallsWithJobOutcomes(
  calls: CallListItem[],
  jobs: JobListItem[],
): CallListItem[] {
  if (jobs.length === 0) {
    return calls;
  }

  const activeJobs = jobs.filter((job) =>
    ACTIVE_JOB_STATUSES.has((job.status ?? "").toLowerCase()),
  );

  return calls.map((call) => {
    if ((call.outcome ?? "").toLowerCase() === "booked") {
      return call;
    }
    if ((call.intent ?? "").toLowerCase() !== "booking") {
      return call;
    }

    const callPhone = phoneDigits(call.caller_number);
    const callName = normalizeName(call.caller_name);

    const matchedJob = activeJobs.find((job) => {
      const phoneMatch =
        callPhone !== null && phoneDigits(job.customer_phone) === callPhone;
      const nameMatch =
        callName !== null && normalizeName(job.customer_name) === callName;
      return phoneMatch || nameMatch;
    });

    if (!matchedJob) {
      return call;
    }

    return {
      ...call,
      outcome: "booked",
      est_value_usd: call.est_value_usd ?? matchedJob.est_value_usd ?? null,
    };
  });
}
