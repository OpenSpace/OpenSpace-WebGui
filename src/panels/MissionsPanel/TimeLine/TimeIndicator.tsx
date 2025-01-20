import { forwardRef } from 'react';
import { Tooltip } from '@mantine/core';
import { ScaleTime } from 'd3';

import { useSubscribeToTime } from '@/api/hooks';

import { TimeIndicatorConfig } from './config';

interface TimeIndicatorProps {
  yScale: ScaleTime<number, number, never>;
  timelineWidth: number;
  scale: number;
}

export const TimeIndicator = forwardRef<SVGRectElement, TimeIndicatorProps>(
  function TimeIndicator({ yScale, timelineWidth, scale }: TimeIndicatorProps, ref) {
    const now = useSubscribeToTime();
    const { color, borderColor, borderWidth, lineWidth, circleRadius } =
      TimeIndicatorConfig;

    // Divide by scale to avoid the line being stretched when zooming
    const lineHeightScaled = lineWidth / scale;
    const heightCircle = circleRadius / scale;
    if (!now) {
      return <></>;
    }

    const offset = lineHeightScaled * 0.5; // Center line around time

    return (
      <Tooltip label={`${new Date(now).toDateString()}`} position={'left'}>
        <g ref={ref} transform={`translate(10, ${yScale(now) - offset})`} x={0}>
          <rect
            style={{ cursor: 'default' }}
            height={lineHeightScaled}
            width={timelineWidth}
            fill={color}
            stroke={borderColor}
            strokeWidth={borderWidth / scale}
          />
          <rect
            style={{ cursor: 'default' }}
            height={(circleRadius * 2) / scale}
            width={circleRadius * 2}
            rx={circleRadius}
            y={-heightCircle + offset}
            fill={color}
            stroke={borderColor}
            strokeWidth={0}
          />
        </g>
      </Tooltip>
    );
  }
);
