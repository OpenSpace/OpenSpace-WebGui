import styles from './FadeIcon.module.css';

interface Props {
  size?: number;
  color?: string;
}

export function FadeIcon({ size = 24, color = 'var(--mantine-primary-color-5)' }: Props) {
  return (
    <div
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        color,
        backgroundImage: `repeating-linear-gradient(
          -45deg,
          ${color},
          ${color} 2.5px,
          transparent 2.5px,
          transparent 7px
        )`,
        animation: `${styles.slide} 1000ms linear infinite`,
        transition: 'opacity 150ms ease'
      }}
    />
  );
}
