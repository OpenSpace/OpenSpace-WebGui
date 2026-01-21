import { rem } from '@mantine/core';

type RadialSweepIconProps = {
  value: number; // 0–100
  size?: number | string;
  color?: string;
  background?: string;
  radius?: number;
};

function sweepWedge(value: number, center: number = 50): string {
  if (value <= 0) return '';

  const angle = Math.min(360, (value / 100) * 360);
  const rad = ((angle - 90) * Math.PI) / 180;

  // BIG radius so wedge covers entire rect
  const R = 200;

  const x = center + R * Math.cos(rad);
  const y = center + R * Math.sin(rad);
  const largeArc = angle > 180 ? 1 : 0;

  return `
    M ${center} ${center}
    L ${center} ${center - R}
    A ${R} ${R} 0 ${largeArc} 1 ${x} ${y}
    Z
  `;
}

export function RadialSweepIcon({
  value,
  size = 12,
  color = '#2196F3',
  background = '#ffffff',
  radius = 1
}: RadialSweepIconProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const pxSize = typeof size === 'number' ? rem(size) : size;
  const sizeNumber = 100;

  return (
    <svg width={pxSize} height={pxSize} viewBox={'0 0 100 100'}>
      <defs>
        <mask id={'sweep-mask'} maskUnits={'userSpaceOnUse'}>
          {/* Hidden by default */}
          <rect width={'100'} height={'100'} fill={'black'} />

          {/* Oversized wedge */}
          <path
            d={sweepWedge(clamped, sizeNumber * 0.5)}
            fill={'white'}
            style={{ transition: 'd 300ms ease' }}
          />
        </mask>
      </defs>

      {/* Background */}
      <rect width={sizeNumber} height={sizeNumber} rx={radius} fill={background} />

      {/* Foreground (fully rectangular fill) */}
      <rect
        width={sizeNumber}
        height={sizeNumber}
        rx={radius}
        fill={color}
        mask={'url(#sweep-mask)'}
      />
    </svg>
  );
}
