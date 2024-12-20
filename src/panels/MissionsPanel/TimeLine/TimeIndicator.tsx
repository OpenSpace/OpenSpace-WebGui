import { forwardRef } from 'react';
import { ScaleTime } from 'd3';

import { useSubscribeToTime } from '@/api/hooks';

import { TimeIndicatorConfig, TimeLineConfig } from './config';

interface TimeIndicatorProps {
  yScale: ScaleTime<number, number, never>;
  timelineWidth: number;
  scale: number;
}

export const TimeIndicator = forwardRef<SVGRectElement, TimeIndicatorProps>(
  function TimeIndicator({ yScale, timelineWidth, scale }: TimeIndicatorProps, ref) {
    const now = useSubscribeToTime();
    const { color, borderColor, borderWidth, lineWidth } = TimeIndicatorConfig;
    const { margin } = TimeLineConfig;

    // Divide by scale to avoid the line being stretched when zooming
    const lineHeightScaled = lineWidth / scale;

    if (!now) {
      return <></>;
    }

    const yPosition = yScale(now) - lineHeightScaled * 0.5; // Center line around time

    return (
      <rect
        ref={ref}
        x={margin.left}
        y={yPosition}
        height={lineHeightScaled}
        width={timelineWidth - margin.left - margin.right}
        fill={color}
        stroke={borderColor}
        strokeWidth={borderWidth / scale}
      />
    );
  }
);
