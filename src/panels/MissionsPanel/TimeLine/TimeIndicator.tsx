import { ScaleTime } from 'd3';

import { useAppSelector } from '@/redux/hooks';

interface TimeIndicatorProps {
  yScale: ScaleTime<number, number, never>;
  margin: { top: number; right: number; bottom: number; left: number };
  timelineWidth: number;
  scale: number;
}

export function TimeIndicator({
  yScale,
  margin,
  timelineWidth,
  scale
}: TimeIndicatorProps) {
  const now = useAppSelector((state) => state.time.timeCapped);
  const lineHeight = 3;
  // Divide by scale to avoid the line being stretched when zooming
  const lineHeightScaled = lineHeight / scale;

  if (!now) {
    return <></>;
  }

  const yPosition = yScale(now) - lineHeightScaled * 0.5; // Center line around time

  return (
    <rect
      x={margin.left}
      y={yPosition}
      height={lineHeightScaled}
      width={timelineWidth - margin.left - margin.right}
      fill={'white'}
      stroke={'black'}
      strokeWidth={0.5 / scale}
    />
  );
}
