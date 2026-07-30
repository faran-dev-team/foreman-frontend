import {
  inputClassName,
  labelClassName,
  SettingsSection,
} from "@/components/settings/settings-section";
import type { ServiceArea } from "@/lib/settings/types";

type ServiceAreaFormProps = {
  value: ServiceArea;
  onChange: (value: ServiceArea) => void;
};

export function ServiceAreaForm({ value, onChange }: ServiceAreaFormProps) {
  const setMode = (mode: ServiceArea["mode"]) => {
    onChange({ ...value, mode });
  };

  return (
    <SettingsSection
      title="Service area"
      description="Where you take jobs. Foreman checks this before booking."
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="service-area-mode"
              checked={value.mode === "zip_codes"}
              onChange={() => setMode("zip_codes")}
              className="text-foreman-navy focus:ring-foreman-navy"
            />
            <span className="text-sm text-slate-900">ZIP codes</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="service-area-mode"
              checked={value.mode === "radius"}
              onChange={() => setMode("radius")}
              className="text-foreman-navy focus:ring-foreman-navy"
            />
            <span className="text-sm text-slate-900">Radius from center ZIP</span>
          </label>
        </div>

        {value.mode === "zip_codes" ? (
          <div>
            <label className={labelClassName} htmlFor="zip-codes">
              ZIP codes (comma-separated)
            </label>
            <input
              id="zip-codes"
              type="text"
              value={value.zipCodes}
              onChange={(e) =>
                onChange({ ...value, zipCodes: e.target.value })
              }
              placeholder="90210, 90211, 90212"
              className={inputClassName}
            />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClassName} htmlFor="center-zip">
                Center ZIP
              </label>
              <input
                id="center-zip"
                type="text"
                value={value.centerZip}
                onChange={(e) =>
                  onChange({ ...value, centerZip: e.target.value })
                }
                placeholder="90210"
                className={inputClassName}
              />
            </div>
            <div>
              <label className={labelClassName} htmlFor="radius-miles">
                Radius (miles)
              </label>
              <input
                id="radius-miles"
                type="number"
                min={1}
                value={value.radiusMiles}
                onChange={(e) =>
                  onChange({
                    ...value,
                    radiusMiles: Number(e.target.value),
                  })
                }
                className={inputClassName}
              />
            </div>
          </div>
        )}
      </div>
    </SettingsSection>
  );
}
