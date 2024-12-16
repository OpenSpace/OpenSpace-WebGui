import { Text, Tooltip } from '@mantine/core';
import { ScaleLinear, ScaleTime } from 'd3';

import { useOpenSpaceApi } from '@/api/hooks';
import { useAppSelector } from '@/redux/hooks';
import { DisplayType } from '@/types/enums';
import { Phase } from '@/types/mission-types';

import { DisplayedPhase } from '../MissionContent';
import { jumpToTime } from '../util';

interface Props {
  scale: number; // d3 scale 'k' value
  xScale: ScaleLinear<number, number, never>;
  yScale: ScaleTime<number, number, never>;
  nestedLevels: number;
  setDisplayedPhase: (phase: DisplayedPhase) => void;
  phase: Phase;
  nestedLevel: number;
  padding?: number;
  color?: React.CSSProperties['color'];
}

export function PhaseRectangle({
  scale,
  xScale,
  yScale,
  nestedLevels,
  setDisplayedPhase,
  phase,
  nestedLevel,
  padding = 0,
  color
}: Props) {
  const now = useAppSelector((state) => state.time.timeCapped);
  const luaApi = useOpenSpaceApi();

  if (now === undefined) {
    return <></>;
  }
  const startTime = new Date(phase.timerange.start);
  const endTime = new Date(phase.timerange.end);

  const isBeforeEndTime = now < endTime.valueOf();
  const isAfterBeginning = now > startTime.valueOf();
  const isCurrent = isBeforeEndTime && isAfterBeginning;

  // Radius for the rectangles that represent phases
  const radiusPhase = 2;
  // Make sure padding doesn't get stretched when zooming
  const paddingY = padding / scale;
  const radiusY = radiusPhase / scale; // same here
  return (
    <Tooltip.Floating
      label={
        <>
          <Text fw={'bold'}>Phase</Text>
          {phase.name}
        </>
      }
    >
      <rect
        x={xScale(nestedLevels - nestedLevel - 1) - padding}
        y={yScale(endTime) - paddingY}
        height={yScale(startTime) - yScale(endTime) + 2 * paddingY}
        width={xScale(1) - xScale(0) + 2 * padding}
        onClick={(event) => {
          setDisplayedPhase({ type: DisplayType.Phase, data: phase });
          if (event.shiftKey) {
            jumpToTime(now, phase.timerange.start, luaApi);
          }
        }}
        ry={radiusY}
        rx={radiusPhase}
        className={isCurrent ? 'highlightedRect' : 'normalRect'}
        style={color ? { fill: color, opacity: 1.0 } : {}}
      />
    </Tooltip.Floating>
  );
}
