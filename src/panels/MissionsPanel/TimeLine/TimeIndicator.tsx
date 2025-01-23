import { forwardRef, useEffect, useRef, useState } from 'react';
import { Tooltip } from '@mantine/core';
import { useThrottledCallback } from '@mantine/hooks';
import { drag, ScaleTime, select } from 'd3';

import { useOpenSpaceApi } from '@/api/hooks';

import { TimeIndicatorConfig } from './config';

interface Props {
  yScale: ScaleTime<number, number, never>;
  timelineWidth: number;
  scale: number;
  now: number;
}

export const TimeIndicator = forwardRef<SVGRectElement, Props>(
  ({ yScale, timelineWidth, scale, now }: Props, ref) => {
    // This y is used while dragging for a smoother UX
    const [y, setY] = useState<number | null>(null);
    const luaApi = useOpenSpaceApi();
    // We don't want to call the OpenSpace api too often
    const throttledSetTime = useThrottledCallback(
      (clampedY: number) => luaApi?.time.setTime(yScale.invert(clampedY).toDateString()),
      100
    );

    const dragRef = useRef<SVGGElement | null>(null);

    // Effect for handling dragging of the indicator
    useEffect(() => {
      if (dragRef.current) {
        const gElement = select(dragRef.current);

        // Calculate the new y from the event
        function getY(dy: number): number {
          const transform = gElement.attr('transform') || 'translate(0,0)';
          const match = /translate\(([^,]+),([^)]+)\)/.exec(transform);
          const [, currentY] = match
            ? [parseFloat(match[1]), parseFloat(match[2])]
            : [0, 0];
          const newY = currentY + dy;

          return newY;
        }

        gElement.call(
          drag<SVGGElement, unknown>()
            .on('start', () => {
              gElement.style('cursor', 'grabbing');
            })
            .on('drag', (event) => {
              const newY = getY(event.dy);
              throttledSetTime(newY);
              setY(newY);
            })
            .on('end', (event) => {
              const newY = getY(event.dy);
              throttledSetTime(newY);
              gElement.style('cursor', 'grab');
              setY(null);
            })
        );
      }
    }, [yScale, dragRef, luaApi?.time, throttledSetTime]);

    // Config style
    const { color, borderColor, borderWidth, lineWidth, circleRadius } =
      TimeIndicatorConfig;
    // Divide by scale to avoid the line being stretched when zooming
    const lineHeightScaled = lineWidth / scale;
    const heightCircle = circleRadius / scale;
    const offset = lineHeightScaled * 0.5; // Center line around time
    const calculatedY = y === null ? yScale(now) - offset : y;

    return (
      <Tooltip label={`${new Date(now).toDateString()}`} position={'left'}>
        {/* This ref is used for manipulating the indicator when dragging */}
        <g
          ref={dragRef}
          style={{ cursor: 'grab' }}
          transform={`translate(0, ${calculatedY})`}
          x={0}
        >
          {/* The ref of the rectangle is used for the time arrows, to indicate
            if the indicator is outside of the view of the timeline */}
          <rect
            ref={ref}
            height={lineHeightScaled}
            width={timelineWidth}
            fill={color}
            stroke={borderColor}
            style={{ cursor: 'inherit' }}
            strokeWidth={borderWidth / scale}
          />
          <rect
            style={{ cursor: 'inherit' }}
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
