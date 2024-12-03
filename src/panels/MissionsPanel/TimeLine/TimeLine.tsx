import { ZoomInIcon, ZoomOutIcon, ZoomOutMapIcon } from '@/icons/icons';
import { Phase } from '@/types/mission-types';
import { ActionIcon, Group, Tooltip, Text } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { DisplayedPhase } from '../MissionsPanel';
import { DisplayType, IconSize } from '@/types/enums';
import { useAppSelector } from '@/redux/hooks';
import {
  axisLeft,
  scaleLinear,
  scaleUtc,
  select,
  zoom,
  ZoomBehavior,
  zoomIdentity,
  zoomTransform
} from 'd3';
import { jumpToTime } from '../util';
import { useOpenSpaceApi } from '@/api/hooks';

import './TimeLine.css';

interface TimeLineProps {
  allPhasesNested: Phase[][];
  displayedPhase: DisplayedPhase;
  overview: Phase;
  setDisplayedPhase: (phase: DisplayedPhase) => void;
}

// TODO: rewrite D3.js usage using this guide? Makes everything more React-esque
// https://2019.wattenberger.com/blog/react-and-d3

export function TimeLine({
  allPhasesNested,
  displayedPhase,
  overview,
  setDisplayedPhase
}: TimeLineProps) {
  const luaApi = useOpenSpaceApi();
  const [scale, setScale] = useState(1);
  const [translation, setTranslation] = useState(0);
  const now = useAppSelector((state) => state.time.timeCapped);

  //   const xAxisRef = useRef<any>(null);
  const yAxisRef = useRef<any>(null);
  const svgRef = useRef<any>(null);
  const zoomRef = useRef<ZoomBehavior<SVGElement, unknown> | null>(null);
  // Set the dimensions and margins of the graph
  const margin = {
    top: 10,
    right: 2,
    bottom: 10,
    left: 60
  };
  const paddingGraph = {
    top: 0,
    inner: 5,
    bottom: 1
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
  // Min and max scale
  const scaleExtent: [number, number] = [1, 1000];
  // Min and max translation
  const translateExtent: [[number, number], [number, number]] = [
    [0, 0],
    [width, height - margin.bottom]
  ];
  // Given in milliseconds
  const transitionDuration = 750;

  const clipPathTop = margin.top - paddingGraph.top;
  const clipPathBottom = height - margin.bottom + 2 * paddingGraph.bottom;

  let selectedPhase: Phase | undefined = undefined;
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

  // TODO right now we don't have a way to get the size of the panel we're in so we can't
  // do any updates related to a panel resize and therefore use a fixed height.
  // When height changes of window, rescale y axis
  /*
  useEffect(() => {
    // Update the axis every time window rescales
    yScale = scaleUtc()
    .range([height - margin.bottom, margin.top])
    .domain(timeRange);
    yAxis = axisLeft(yScale);
    select(yAxisRef.current).call(yAxis);
}, [height]);
*/

  // On mount, style axes
  useEffect(() => {
    select(yAxisRef.current).call(yAxis);
    // TODO set font family? Previously was 'Segoe UI' font on ticks
    select(yAxisRef.current).selectAll('.tick text').style('font-size', '1.3em');
  }, []);

  // Add zoom and update it every the the y scale changes (TODO: panel resize)
  useEffect(() => {
    zoomRef.current = zoom<SVGElement, unknown>()
      .on('zoom', (event) => {
        // TODO: event is any here which is super annoying, try to find a way to get this
        // typed properly..
        const newYScale = event.transform.rescaleY(yScale);
        select(yAxisRef.current).call(yAxis.scale(newYScale));
        setScale(event.transform.k);
        setTranslation(event.transform.y);
      })
      .scaleExtent(scaleExtent)
      .extent(translateExtent)
      .translateExtent(translateExtent);
    select(svgRef.current).call(zoomRef.current);
  }, [yScale]);

  function reset() {
    if (!zoomRef.current) {
      return;
    }
    select(svgRef.current)
      .transition()
      .duration(transitionDuration)
      .call(
        zoomRef.current.transform,
        zoomIdentity,
        zoomTransform(select(svgRef.current).node()).invert([width * 0.5, height * 0.5])
      );
  }
  function zoomByButton(zoomValue: number) {
    if (!zoomRef.current) {
      return;
    }
    select(svgRef.current)
      .transition()
      .duration(transitionDuration)
      .call(zoomRef.current.scaleBy, zoomValue);
  }

  function createRectangle(
    phase: Phase,
    nestedLevel: number,
    padding: number = 0,
    color?: React.CSSProperties['color']
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
          key={`${phase.name}${startTime}-${endTime}`}
          x={xScale(nestedLevels - nestedLevel - 1) - padding}
          y={yScale(endTime) - paddingY}
          height={yScale(startTime) - yScale(endTime) + 2 * paddingY}
          width={xScale(1) - xScale(0) + 2 * padding}
          onClick={(event) => {
            setDisplayedPhase({ type: DisplayType.Phase, data: phase });
            // TODO: Make into a function?
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

  return (
    <div style={{ flexGrow: 0 }}>
      <Group gap={0} justify="space-between">
        <ActionIcon onClick={() => zoomByButton(0.5)} aria-label={'Zoom in timeline'}>
          <ZoomOutIcon size={IconSize.sm} />
        </ActionIcon>
        <ActionIcon onClick={() => zoomByButton(2.0)} aria-label={'Zoom out timeline'}>
          <ZoomInIcon size={IconSize.sm} />
        </ActionIcon>
        <ActionIcon onClick={() => reset()} aria-label={'Full view timeline'}>
          <ZoomOutMapIcon size={IconSize.sm} />
        </ActionIcon>
      </Group>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{
          clipPath: `polygon(0% ${clipPathTop}px, 100% ${clipPathTop}px,
           100% ${clipPathBottom}px, 0% ${clipPathBottom}px`
        }}
      >
        <g transform={`translate(0, ${paddingGraph.top})`}>
          <g
            ref={yAxisRef}
            transform={`translate(${margin.left - paddingGraph.inner}, ${0})`}
          />
          {/* This group transforms all the rectangles correctly when we scale and zoom in
              the timeline */}
          <g transform={`translate(0, ${translation})scale(1, ${scale})`}>
            {allPhasesNested.map((nestedPhase, index) =>
              nestedPhase.map((phase) => {
                if (
                  displayedPhase.type === DisplayType.Phase &&
                  displayedPhase.data.name === phase.name
                ) {
                  // We want to draw the selected phase last so it appears on top, save it
                  // for later
                  selectedPhase = phase;
                  selectedPhaseIndex = index;
                  return null;
                }
                return createRectangle(phase, index);
              })
            )}
            {selectedPhase && (
              <>
                {createRectangle(selectedPhase, selectedPhaseIndex, 2, 'white')}
                {createRectangle(selectedPhase, selectedPhaseIndex)}
              </>
            )}
          </g>
        </g>
      </svg>
    </div>
  );
}
