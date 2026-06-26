import {
  inputClassName,
  labelClassName,
  SettingsSection,
} from "@/components/settings/settings-section";
import { DAYS_OF_WEEK, type BusinessHours, type DayOfWeek } from "@/lib/settings/types";

function formatDayLabel(day: DayOfWeek): string {
  return day.charAt(0).toUpperCase() + day.slice(1);
}

type BusinessHoursFormProps = {
  value: BusinessHours;
  onChange: (value: BusinessHours) => void;
};

export function BusinessHoursForm({ value, onChange }: BusinessHoursFormProps) {
  const updateDay = (day: DayOfWeek, patch: Partial<BusinessHours[DayOfWeek]>) => {
    onChange({
      ...value,
      [day]: { ...value[day], ...patch },
    });
  };

  return (
    <SettingsSection
      title="Business hours"
      description="When your shop is open. Foreman uses this with your calendar for availability."
    >
      <div className="space-y-3">
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day}
            className="flex flex-wrap items-center gap-4 rounded-lg border border-slate-100 bg-slate-50/50 px-4 py-3"
          >
            <label className="flex w-32 items-center gap-2">
              <input
                type="checkbox"
                checked={value[day].enabled}
                onChange={(e) => updateDay(day, { enabled: e.target.checked })}
                className="rounded border-slate-300 text-foreman-navy focus:ring-foreman-navy"
              />
              <span className="text-sm font-medium text-slate-900">
                {formatDayLabel(day)}
              </span>
            </label>

            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className={labelClassName} htmlFor={`${day}-open`}>
                  Open
                </label>
                <input
                  id={`${day}-open`}
                  type="time"
                  value={value[day].open}
                  disabled={!value[day].enabled}
                  onChange={(e) => updateDay(day, { open: e.target.value })}
                  className={inputClassName}
                />
              </div>
              <div>
                <label className={labelClassName} htmlFor={`${day}-close`}>
                  Close
                </label>
                <input
                  id={`${day}-close`}
                  type="time"
                  value={value[day].close}
                  disabled={!value[day].enabled}
                  onChange={(e) => updateDay(day, { close: e.target.value })}
                  className={inputClassName}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </SettingsSection>
  );
}
