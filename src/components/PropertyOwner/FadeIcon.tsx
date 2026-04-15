import { ActionIcon } from '@mantine/core';

import styles from './FadeIcon.module.css';

interface Props {
  size?: number;
  color?: string;
  onClick?: () => void;
}

export function FadeIcon({
  size = 20,
  color = 'var(--mantine-primary-color-5)',
  onClick
}: Props) {
  const stripeWidth = size * 0.15;
  const repeat = size * 0.3;

  return (
    <ActionIcon size={size} onClick={onClick}>
      <div
        style={{
          // Since the div is rotated, we need to increase the
          // width and height to avoid clipping
          width: size * Math.SQRT2,
          height: size * Math.SQRT2,
          flexShrink: 0,
          color,
          backgroundImage: `repeating-linear-gradient(
            ${color},
            ${color} ${stripeWidth}px,
            transparent ${stripeWidth}px,
            transparent ${repeat}px
          )`,
          backgroundSize: `${repeat}px ${repeat}px`,
          animation: `${styles.slide} 1000ms linear infinite`,
          transition: 'opacity 150ms ease',
          transform: 'rotate(-45deg)'
        }}
      />
    </ActionIcon>
  );
}
