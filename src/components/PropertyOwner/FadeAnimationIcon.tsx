import { useId } from 'react';

interface Props {
  size?: number;
  color?: string;
  radius?: string | number;
}

export function FadeAnimationIcon({
  size = 20,
  color = 'var(--mantine-primary-color-5)',
  radius = 'var(--mantine-radius-default)'
}: Props) {
  const stripeWidth = size * 0.15;
  const repeat = size * 0.3;
  const patternId = useId();

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden={'true'}>
      <defs>
        <pattern
          id={patternId}
          patternUnits={'userSpaceOnUse'}
          width={repeat}
          height={repeat}
          patternTransform={'rotate(45)'}
        >
          <rect width={stripeWidth} height={repeat} fill={color} />
          <animateTransform
            attributeName={'patternTransform'}
            type={'translate'}
            from={'0 0'}
            to={`${repeat} 0`}
            dur={'1000ms'}
            repeatCount={'indefinite'}
            additive={'sum'}
          />
        </pattern>
      </defs>
      <rect
        width={size}
        height={size}
        rx={radius}
        ry={radius}
        fill={`url(#${patternId})`}
      />
    </svg>
  );
}
