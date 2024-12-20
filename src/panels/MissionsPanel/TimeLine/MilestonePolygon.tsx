import { Text, Tooltip } from '@mantine/core';
import { ScaleTime } from 'd3';

import { DisplayType } from '@/types/enums';
import { Milestone } from '@/types/mission-types';

import { useJumpToTime } from '../hooks';
import { DisplayedPhase } from '../MissionContent';

import { MileStoneConfig } from './config';

interface Props {
  scale: number; // d3 scale 'k' value
  yScale: ScaleTime<number, number, never>;
  marginLeft: number;
  setDisplayedPhase: (phase: DisplayedPhase) => void;
  milestone: Milestone;
  displayBorder?: boolean;
}

export function MileStonePolygon({
  scale,
  yScale,
  marginLeft,
  setDisplayedPhase,
  milestone,
  displayBorder
}: Props) {
  const jumpToTime = useJumpToTime();
  const { size, borderWidth, color, borderColor } = MileStoneConfig;
  const time = new Date(milestone.date);
  const padding = displayBorder ? borderWidth : 0;
  const w = size + 2 * padding; // Width of polygon
  const yPos = yScale(time) - (w * 0.5) / scale;
  const x = marginLeft - w;
  const centerOffsetX = w * 0.5;

  function handleClick(shiftIsPressed: boolean) {
    setDisplayedPhase({ type: DisplayType.Milestone, data: milestone });
    if (shiftIsPressed) {
      jumpToTime(milestone.date);
    }
  }

  return (
    <Tooltip
      label={
        <>
          <Text fw={'bold'}>Milestone</Text>
          {milestone.name}
        </>
      }
    >
      <polygon
        points={`0, ${w * 0.5} ${w * 0.5}, ${w} ${w}, ${w * 0.5} ${w * 0.5}, 0`}
        transform={`translate(${x + centerOffsetX}, ${yPos})scale(1.0, ${1.0 / scale})`}
        fill={color}
        stroke={borderColor}
        strokeWidth={displayBorder ? borderWidth : 0}
        onClick={(event) => {
          handleClick(event.shiftKey);
        }}
      />
    </Tooltip>
  );
}