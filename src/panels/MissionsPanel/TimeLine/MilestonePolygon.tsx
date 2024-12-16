import { Text, Tooltip } from '@mantine/core';
import { ScaleTime } from 'd3';

import { useOpenSpaceApi } from '@/api/hooks';
import { useAppSelector } from '@/redux/hooks';
import { DisplayType } from '@/types/enums';
import { Milestone } from '@/types/mission-types';

import { DisplayedPhase } from '../MissionContent';
import { jumpToTime } from '../util';

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
  const now = useAppSelector((state) => state.time.timeCapped);
  const luaApi = useOpenSpaceApi();

  const time = new Date(milestone.date);
  const polygonSize = 12;
  const padding = displayBorder ? 2 : 0;
  const w = polygonSize + 2 * padding; // Width of polygon
  const yPos = yScale(time) - (w * 0.5) / scale;
  const x = marginLeft - w;
  const centerOffsetX = w * 0.5;
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
        fill={'orange'}
        stroke={'white'}
        strokeWidth={displayBorder ? 2.0 : 0}
        onClick={(event) => {
          setDisplayedPhase({ type: DisplayType.Milestone, data: milestone });
          if (event.shiftKey) {
            jumpToTime(now, milestone.date, luaApi);
          }
        }}
      />
    </Tooltip>
  );
}
