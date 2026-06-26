import {
  inputClassName,
  labelClassName,
  SettingsSection,
} from "@/components/settings/settings-section";
import { createEmptyService } from "@/lib/settings/defaults";
import type { ServiceItem } from "@/lib/settings/types";

type ServicesFormProps = {
  value: ServiceItem[];
  onChange: (value: ServiceItem[]) => void;
};

export function ServicesForm({ value, onChange }: ServicesFormProps) {
  const updateService = (id: string, patch: Partial<ServiceItem>) => {
    onChange(value.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const addService = () => {
    onChange([...value, createEmptyService()]);
  };

  const removeService = (id: string) => {
    onChange(value.filter((s) => s.id !== id));
  };

  return (
    <SettingsSection
      title="Services & pricing"
      description="Services your agent can quote. Use price ranges only — never exact quotes."
    >
      <div className="space-y-6">
        {value.map((service, index) => (
          <div
            key={service.id}
            className="rounded-lg border border-slate-200 p-4"
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">
                Service {index + 1}
              </p>
              {value.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeService(service.id)}
                  className="text-sm font-medium text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClassName} htmlFor={`${service.id}-name`}>
                  Service name
                </label>
                <input
                  id={`${service.id}-name`}
                  type="text"
                  value={service.name}
                  onChange={(e) =>
                    updateService(service.id, { name: e.target.value })
                  }
                  placeholder="AC not cooling / repair"
                  className={inputClassName}
                />
              </div>

              <div>
                <label className={labelClassName} htmlFor={`${service.id}-min`}>
                  Price min ($)
                </label>
                <input
                  id={`${service.id}-min`}
                  type="number"
                  min={0}
                  value={service.priceMin}
                  onChange={(e) =>
                    updateService(service.id, {
                      priceMin: Number(e.target.value),
                    })
                  }
                  className={inputClassName}
                />
              </div>

              <div>
                <label className={labelClassName} htmlFor={`${service.id}-max`}>
                  Price max ($)
                </label>
                <input
                  id={`${service.id}-max`}
                  type="number"
                  min={0}
                  value={service.priceMax}
                  onChange={(e) =>
                    updateService(service.id, {
                      priceMax: Number(e.target.value),
                    })
                  }
                  className={inputClassName}
                />
              </div>

              <div>
                <label
                  className={labelClassName}
                  htmlFor={`${service.id}-duration`}
                >
                  Duration (minutes)
                </label>
                <input
                  id={`${service.id}-duration`}
                  type="number"
                  min={15}
                  step={15}
                  value={service.durationMin}
                  onChange={(e) =>
                    updateService(service.id, {
                      durationMin: Number(e.target.value),
                    })
                  }
                  className={inputClassName}
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  className={labelClassName}
                  htmlFor={`${service.id}-keywords`}
                >
                  Keywords (comma-separated)
                </label>
                <input
                  id={`${service.id}-keywords`}
                  type="text"
                  value={service.keywords}
                  onChange={(e) =>
                    updateService(service.id, { keywords: e.target.value })
                  }
                  placeholder="ac, furnace, tune up"
                  className={inputClassName}
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addService}
          className="rounded-lg border border-dashed border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
        >
          + Add service
        </button>
      </div>
    </SettingsSection>
  );
}
