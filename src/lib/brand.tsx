/**
 * Shared Foreman brand tokens + mark — used by marketing landing and owner dashboard.
 * Keep in sync with marketing carbon/amber system.
 */
export const brand = {
  carbon: "#0A0F1C",
  carbonElevated: "#141C30",
  carbonDeep: "#05080F",
  orange: "#F97A35",
  green: "#1FAA59",
  greenBg: "#163C2A",
  textMuted: "#B8BFCC",
  border: "rgba(255,255,255,0.08)",
} as const;

export function ForemanLogo({
  size = 40,
  bg = brand.orange,
  fg = brand.carbon,
  className,
}: {
  size?: number;
  bg?: string;
  fg?: string;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden
      className={className}
    >
      <rect width="100" height="100" rx="24" fill={bg} />
      <rect x="30" y="26" width="16" height="52" rx="2.5" fill={fg} />
      <rect x="30" y="26" width="44" height="16" rx="2.5" fill={fg} />
      <rect x="30" y="49" width="32" height="14" rx="2.5" fill={fg} />
    </svg>
  );
}
