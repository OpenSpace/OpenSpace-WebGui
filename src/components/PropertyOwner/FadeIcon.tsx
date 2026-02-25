type FadeIconProps = {
  value: number; // 0–1
  size?: number;
  color?: string;
};

export function FadeIcon({
  value,
  size = 14,
  color = 'var(--mantine-primary-color-5)',
}: FadeIconProps) {
  const clamped = Math.max(0, Math.min(1, value));

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect
        width={size}
        height={size}
        fill={color}
        opacity={clamped}
        style={{ transition: 'opacity 150ms ease' }}
      />
    </svg>
  );
}
