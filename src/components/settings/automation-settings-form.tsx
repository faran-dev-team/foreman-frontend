import {
  inputClassName,
  labelClassName,
  SettingsSection,
} from "@/components/settings/settings-section";
import type {
  AppointmentReminderSettings,
  FollowUpAutomationSettings,
  ReviewAutomationSettings,
} from "@/lib/settings/types";

type AutomationSettingsFormProps = {
  reviewAutomation: ReviewAutomationSettings;
  appointmentReminders: AppointmentReminderSettings;
  followUpAutomation: FollowUpAutomationSettings;
  onReviewChange: (value: ReviewAutomationSettings) => void;
  onRemindersChange: (value: AppointmentReminderSettings) => void;
  onFollowUpChange: (value: FollowUpAutomationSettings) => void;
};

function ToggleRow({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <label htmlFor={id} className="text-sm font-medium text-slate-900">
          {label}
        </label>
        <p className="mt-0.5 text-xs text-slate-500">{description}</p>
      </div>
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-foreman-navy focus:ring-offset-2 ${
          checked ? "bg-emerald-600" : "bg-slate-200"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow transition ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

export function AutomationSettingsForm({
  reviewAutomation,
  appointmentReminders,
  followUpAutomation,
  onReviewChange,
  onRemindersChange,
  onFollowUpChange,
}: AutomationSettingsFormProps) {
  return (
    <SettingsSection
      title="Automation & messaging"
      description="Control review asks, appointment reminders, and post-service follow-ups. These map to shop settings on the backend (off by default until you enable them)."
    >
      <div className="space-y-8">
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-slate-800">
            Google review asks
          </h4>
          <ToggleRow
            id="review-automation-enabled"
            label="Enable review automation"
            description="After a job is completed, schedule a Google review request email."
            checked={reviewAutomation.reviewAutomationEnabled}
            onChange={(reviewAutomationEnabled) =>
              onReviewChange({ ...reviewAutomation, reviewAutomationEnabled })
            }
          />
          <div>
            <label className={labelClassName} htmlFor="google-review-url">
              Google review URL
            </label>
            <input
              id="google-review-url"
              type="url"
              value={reviewAutomation.googleReviewUrl}
              onChange={(e) =>
                onReviewChange({
                  ...reviewAutomation,
                  googleReviewUrl: e.target.value,
                })
              }
              placeholder="https://g.page/r/…"
              className={inputClassName}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClassName} htmlFor="review-delay">
                Delay after completion (minutes)
              </label>
              <input
                id="review-delay"
                type="number"
                min={0}
                max={43200}
                value={reviewAutomation.reviewDelayMinutes}
                onChange={(e) =>
                  onReviewChange({
                    ...reviewAutomation,
                    reviewDelayMinutes: Number(e.target.value) || 0,
                  })
                }
                className={inputClassName}
              />
            </div>
            <div>
              <label className={labelClassName} htmlFor="review-retries">
                Max retries
              </label>
              <input
                id="review-retries"
                type="number"
                min={0}
                max={20}
                value={reviewAutomation.reviewMaxRetries}
                onChange={(e) =>
                  onReviewChange({
                    ...reviewAutomation,
                    reviewMaxRetries: Number(e.target.value) || 0,
                  })
                }
                className={inputClassName}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6 space-y-4">
          <h4 className="text-sm font-semibold text-slate-800">
            Appointment reminders
          </h4>
          <ToggleRow
            id="reminder-automation-enabled"
            label="Enable appointment reminders"
            description="Schedule 24-hour and 1-hour reminder emails when appointments are booked."
            checked={appointmentReminders.appointmentReminderEnabled}
            onChange={(appointmentReminderEnabled) =>
              onRemindersChange({
                ...appointmentReminders,
                appointmentReminderEnabled,
              })
            }
          />
          <div className="sm:max-w-xs">
            <label className={labelClassName} htmlFor="reminder-retries">
              Max retries
            </label>
            <input
              id="reminder-retries"
              type="number"
              min={0}
              max={20}
              value={appointmentReminders.appointmentReminderMaxRetries}
              onChange={(e) =>
                onRemindersChange({
                  ...appointmentReminders,
                  appointmentReminderMaxRetries: Number(e.target.value) || 0,
                })
              }
              className={inputClassName}
            />
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6 space-y-4">
          <h4 className="text-sm font-semibold text-slate-800">
            Post-service follow-ups
          </h4>
          <ToggleRow
            id="follow-up-automation-enabled"
            label="Enable follow-up emails"
            description="After a job is completed, schedule a feedback / rating email."
            checked={followUpAutomation.followUpAutomationEnabled}
            onChange={(followUpAutomationEnabled) =>
              onFollowUpChange({
                ...followUpAutomation,
                followUpAutomationEnabled,
              })
            }
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClassName} htmlFor="follow-up-delay">
                Delay after completion (minutes)
              </label>
              <input
                id="follow-up-delay"
                type="number"
                min={0}
                max={43200}
                value={followUpAutomation.followUpDelayMinutes}
                onChange={(e) =>
                  onFollowUpChange({
                    ...followUpAutomation,
                    followUpDelayMinutes: Number(e.target.value) || 0,
                  })
                }
                className={inputClassName}
              />
              <p className="mt-1 text-xs text-slate-500">
                Default 1440 = 24 hours.
              </p>
            </div>
            <div>
              <label className={labelClassName} htmlFor="follow-up-retries">
                Max retries
              </label>
              <input
                id="follow-up-retries"
                type="number"
                min={0}
                max={20}
                value={followUpAutomation.followUpMaxRetries}
                onChange={(e) =>
                  onFollowUpChange({
                    ...followUpAutomation,
                    followUpMaxRetries: Number(e.target.value) || 0,
                  })
                }
                className={inputClassName}
              />
            </div>
          </div>
        </div>
      </div>
    </SettingsSection>
  );
}
