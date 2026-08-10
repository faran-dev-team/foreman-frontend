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
  size = 10,
  width,
  className,
  style,
}: {
  size?: number;
  width?: number | string;
  bg?: string;
  fg?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <img
      src="/images/foreman_ai.png"
      alt="Foreman AI"
      height={size}
      className={className}
      style={{
        height: size,
        width: width ?? "auto",
        aspectRatio: "1536 / 1024",
        objectFit: "contain",
        display: "inline-block",
        borderRadius: size > 24 ? 6 : 3,
        ...style,
      }}
    />
  );
}
