import {
  inputClassName,
  labelClassName,
  SettingsSection,
} from "@/components/settings/settings-section";

type AgentGreetingFormProps = {
  value: string;
  onChange: (value: string) => void;
};

export function AgentGreetingForm({ value, onChange }: AgentGreetingFormProps) {
  return (
    <SettingsSection
      title="Agent greeting"
      description="Opening line when Foreman answers. Must include recording consent (legal requirement)."
    >
      <div>
        <label className={labelClassName} htmlFor="agent-greeting">
          Greeting script
        </label>
        <textarea
          id="agent-greeting"
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Thanks for calling {{shop_name}}..."
          className={`${inputClassName} resize-y`}
        />
        <p className="mt-2 text-xs text-slate-500">
          Use <code className="rounded bg-slate-100 px-1">{"{{shop_name}}"}</code>{" "}
          as a placeholder for your business name. Include a recording notice in
          the first line.
        </p>
      </div>
    </SettingsSection>
  );
}
