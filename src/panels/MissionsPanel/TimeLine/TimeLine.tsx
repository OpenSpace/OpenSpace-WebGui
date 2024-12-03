import { ZoomInIcon, ZoomOutIcon, ZoomOutMapIcon } from '@/icons/icons';
import { Phase } from '@/types/mission-types';
import { ActionIcon, Group } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { DisplayedPhase } from '../MissionsPanel';
import { DisplayType } from '@/types/enums';
import { useAppSelector } from '@/redux/hooks';
import {
  Axis,
  axisBottom,
  axisLeft,
  axisTop,
  NumberValue,
  scaleLinear,
  scaleUtc,
  select
} from 'd3';

interface TimeLineProps {
  allPhasesNested: Phase[][];
  displayedPhase: DisplayedPhase;
  overview: Phase;
  setDisplayedPhase: (phase: DisplayedPhase) => void;
}

// TODO: rewrite D3.js usage using this guide?
// https://2019.wattenberger.com/blog/react-and-d3

export function TimeLine({
  allPhasesNested,
  displayedPhase,
  overview,
  setDisplayedPhase
}: TimeLineProps) {
  const [scale, setScale] = useState(1);
  const [translation, setTranslation] = useState(0);
  const now = useAppSelector((state) => state.time.timeCapped);

  const xAxisRef = useRef<any>(null);
  const yAxisRef = useRef<any>(null);

  // Set the dimensions and margins of the graph
  const margin = {
    top: 10,
    right: 0,
    bottom: 10,
    left: 60
  };
  const paddingGrpah = {
    top: 0,
    inner: 5
  };

  // Depth of nesting for phases
  const nestedLevels = allPhasesNested.length;
  // Minimum width of a phase
  const minLevelWidth = 20;
  // Ensure graph is large enough to show all phases
  const minWidth = minLevelWidth * nestedLevels + margin.left + margin.right;

  // Height of graph
  //   const height = fullHeight - zoomButtonHeight;
  const height = 550;
  // Width of graph
  const maxWidth = 90; // previously fullWidth
  // Width of graph
  const width = Math.max(maxWidth, minWidth);

  let selectedPhase: Phase;
  let selectedPhaseIndex: number = 0;

  const timeRange = [
    new Date(overview.timerange.start),
    new Date(overview.timerange.end)
  ];
  const xScale = scaleLinear()
    .range([margin.left, width - margin.right])
    .domain([0, nestedLevels]);
  let yScale = scaleUtc([height - margin.bottom, margin.top]).domain(timeRange);

  // Calculate axes
  let yAxis = axisLeft(yScale);
  // TODO: we dont need the xAxis since we're not plotting anything on it anyways
  //   const xAxis = axisTop(xScale)
  //     .tickFormat(() => '')
  //     .tickSize(0)
  //     .ticks(nestedLevels);

  useEffect(() => {
    select(yAxisRef.current).call(yAxis);
    select(yAxisRef.current).selectAll('.tick text').style('font-size', '1.3em');
  }, []);

  function zoomByButton(zoomBy: number) {}
  function reset() {}

  function createRectangle(
    phase: Phase,
    nestedLevel: number,
    padding: number = 0
  ): React.JSX.Element {
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
    const paddingY = padding / scale; // Make sure padding doesn't get stretched when zooming
    const radiusY = 5; // radiusPhase / scale;

    const style: React.CSSProperties = isCurrent
      ? {
          fill: 'var(--mantine-primary-color-4)',
          opacity: 0.95
        }
      : { fill: 'grey', opacity: 0.9 };

    return (
      <rect
        key={`${phase.name}${startTime}-${endTime}`}
        x={xScale(nestedLevels - nestedLevel - 1) - padding}
        y={yScale(endTime) - paddingY}
        height={yScale(startTime) - yScale(endTime) + 2 * paddingY}
        width={xScale(1) - xScale(0) + 2 * padding}
        onClick={(event) => {
          setDisplayedPhase({ type: DisplayType.Phase, data: phase });
        }}
        rx={radiusPhase}
        ry={radiusPhase}
        style={style}
        strokeWidth={0}
      />
    );
  }

  return (
    <div style={{ backgroundColor: 'blue', flexGrow: 0 }}>
      <Group gap={0} justify="space-between">
        <ActionIcon onClick={() => zoomByButton(0.5)} aria-label={'Zoom in timeline'}>
          <ZoomInIcon />
        </ActionIcon>
        <ActionIcon onClick={() => zoomByButton(2.0)} aria-label={'Zoom out timeline'}>
          <ZoomOutIcon />
        </ActionIcon>
        <ActionIcon onClick={() => reset()} aria-label={'Full view timeline'}>
          <ZoomOutMapIcon />
        </ActionIcon>
      </Group>
      <svg style={{ backgroundColor: 'red' }} width={width} height={height}>
        <g transform={`translate(0, ${paddingGrpah.top})`}>
          <g
            ref={yAxisRef}
            transform={`translate(${margin.left - paddingGrpah.inner}, ${0})`}
          />
          <g transform={`translate(0, ${translation})scale(1, ${scale})`}>
            {allPhasesNested.map((nestedPhase, index) =>
              nestedPhase.map((phase) => {
                //   if (
                //     displayedPhase.type === DisplayType.Phase &&
                //     displayedPhase.data.name === phase.name
                //   ) {
                //     // We want to draw the selected phase last so it appears on top, save it
                //     // for later
                //     selectedPhase = phase;
                //     selectedPhaseIndex = index;
                //     return null;
                //   }
                return createRectangle(phase, index);
              })
            )}
          </g>
        </g>
      </svg>
    </div>
  );
}
