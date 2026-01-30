import { useId } from 'react';

type RadialSweepIconProps = {
  value: number; // 0–100
  size?: number;
  color?: string;
  background?: string;
};

function sweepWedge(value: number, center: number = 50): string {
  if (value <= 0) return '';

  const angle = Math.min(360, (value / 100) * 360);

  // Special case: full circle
  if (angle >= 360) {
    return `M ${center} ${center} m -${center} 0 a ${center} ${center} 0 1 0 ${center * 2} 0 a ${center} ${center} 0 1 0 -${center * 2} 0`;
  }

  // Use a radius that extends well beyond the viewBox
  const R = 300;

  // Start angle at top (12 o'clock = -90 degrees)
  const startAngle = -90;
  const endAngle = startAngle + angle;

  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;

  const x1 = center + R * Math.cos(startRad);
  const y1 = center + R * Math.sin(startRad);
  const x2 = center + R * Math.cos(endRad);
  const y2 = center + R * Math.sin(endRad);

  const largeArc = angle > 180 ? 1 : 0;

  return `
    M ${center} ${center}
    L ${x1} ${y1}
    A ${R} ${R} 0 ${largeArc} 1 ${x2} ${y2}
    Z
  `;
}

export function RadialSweepIcon({
  value,
  size = 12,
  color = '#2196F3',
  background = '#ffffff'
}: RadialSweepIconProps) {
  // Creates a value between 0 and 100 (percentage)
  const clamped = Math.max(0, Math.min(100, value));
  const sizeNumber = 100;
  // Using an id for the mask to avoid collisions with other instances
  const maskId = useId();

  return (
    <svg width={size} height={size} viewBox={'0 0 100 100'} shapeRendering={'crispEdges'}>
      <defs>
        {/* Uses black and white to create a mask */}
        <mask id={maskId} maskUnits={'userSpaceOnUse'}>
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
      <rect width={sizeNumber} height={sizeNumber} fill={background} />

      {/* Foreground (fully rectangular fill) masked by the mask above */}
      <rect
        width={sizeNumber}
        height={sizeNumber}
        fill={color}
        mask={`url(#${maskId})`}
      />
    </svg>
  );
}
