import { useEffect, useMemo, useRef, useState } from 'react';
import { ActionIcon, Group } from '@mantine/core';
import {
  axisLeft,
  scaleUtc,
  select,
  zoom,
  ZoomBehavior,
  zoomIdentity,
  zoomTransform
} from 'd3';

import { useSubscribeToTime } from '@/api/hooks';
import { ZoomInIcon, ZoomOutIcon, ZoomOutMapIcon } from '@/icons/icons';
import { DisplayType, IconSize } from '@/types/enums';
import { Phase } from '@/types/mission-types';

import { DisplayedPhase } from '../MissionContent';

import { ActivityCircle } from './ActivityCircle';
import { TimeLineConfig } from './config';
import { MileStonePolygon } from './MilestonePolygon';
import { Phases } from './Phases';
import { TimeArrow } from './TimeArrow';
import { TimeIndicator } from './TimeIndicator';

import './TimeLine.css';

interface TimeLineProps {
  allPhasesNested: Phase[][];
  displayedPhase: DisplayedPhase;
  missionOverview: Phase;
  setDisplayedPhase: (phase: DisplayedPhase) => void;
}

export function TimeLine({
  allPhasesNested,
  displayedPhase,
  missionOverview,
  setDisplayedPhase
}: TimeLineProps) {
  const [scale, setScale] = useState(1);
  const [translation, setTranslation] = useState(0);
  const now = useSubscribeToTime();
  // TODO anden88: no idea how to type the ref here properly without 1000 errors later
  // const xAxisRef = useRef<any>(null);
  const yAxisRef = useRef<any>(null);
  const svgRef = useRef<any>(null);
  const zoomRef = useRef<ZoomBehavior<SVGElement, unknown> | null>(null);
  const timeIndicatorRef = useRef<SVGRectElement | null>(null);

  const {
    minLevelWidth,
    margin,
    maxWidth,
    maxScale,
    height,
    paddingGraph,
    transitionDuration
  } = TimeLineConfig;

  // Depth of nesting for phases
  const nestedLevels = allPhasesNested.length;

  // Ensure graph is large enough to show all phases
  const minWidth = minLevelWidth * nestedLevels + margin.left + margin.right;

  // Height of graph
  // TODO anden88: right now we don't have a way to get the size of the panel we're in so we can't
  // do any updates related to a panel resize and therefore use a fixed height.
  // When height changes of window, rescale y axis
  // const height = fullHeight - zoomButtonHeight;

  // Width of graph
  const width = Math.max(maxWidth, minWidth);

  const clipPathTop = margin.top - paddingGraph.top;
  const clipPathBottom = height - margin.bottom + 2 * paddingGraph.bottom;

  // Calculate y axis
  // Memoize this so we don't get effect triggers every render
  const [yAxis, yScale] = useMemo(() => {
    const timeRange = [
      new Date(missionOverview.timerange.start),
      new Date(missionOverview.timerange.end)
    ];
    const yScale = scaleUtc([height - margin.bottom, margin.top]).domain(timeRange);

    const yAxis = axisLeft(yScale);
    return [yAxis, yScale];
  }, [missionOverview, margin.bottom, margin.top, height]);

  // TODO: When we get the height from the panel we can update the timeline size as well.
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

  useEffect(() => {
    select(yAxisRef.current).call(yAxis);
    // TODO set font family? Previously was 'Segoe UI' font on ticks
    select(yAxisRef.current).selectAll('.tick text').style('font-size', '1.3em');
  }, [yAxis]);

  // Add zoom and update it every the the y scale changes
  // (TODO: panel resize)
  useEffect(() => {
    // Min and max scale
    const scaleExtent: [number, number] = [1, maxScale];
    // Min and max translation
    const translateExtent: [[number, number], [number, number]] = [
      [0, 0],
      [width, height - margin.bottom]
    ];
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
  }, [yScale, yAxis, maxScale, margin.bottom, width, height]);

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

  function centerTime() {
    if (!now || !zoomRef.current) {
      return;
    }
    // Calculate new translation
    const centerY = (height * 0.5) / scale;
    const deltaY = centerY - yScale(now);

    const transform = zoomIdentity.scale(scale).translate(1, deltaY);
    select(svgRef.current)
      .transition()
      .duration(transitionDuration)
      .call(zoomRef.current.transform, transform);
  }

  function computeFadeMask() {
    // Adds fading to the top and/or bottom of the timeline if there is more to show.
    const topFade = translation < 0 ? '5%' : '0%';
    // The translation is scaled as we zoom in so we do the same scaling to the height
    // of the timeline
    const isAtBottom = Math.abs(translation) >= (height - margin.bottom) * (scale - 1);
    const bottomFade = isAtBottom ? '100%' : '95%';
    return `linear-gradient(transparent, black ${topFade}, black ${bottomFade}, transparent)`;
  }

  return (
    <div style={{ flexGrow: 0 }}>
      <Group justify={'flex-end'}>
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
           100% ${clipPathBottom}px, 0% ${clipPathBottom}px`,
          mask: computeFadeMask()
        }}
      >
        <g transform={`translate(0, ${paddingGraph.top})`}>
          <g
            ref={yAxisRef}
            transform={`translate(${margin.left - paddingGraph.inner}, ${0})`}
          />
          {/* This group transforms all the children correctly when we scale and zoom in
              the timeline */}
          <g transform={`translate(0, ${translation})scale(1, ${scale})`}>
            <Phases
              allPhasesNested={allPhasesNested}
              displayedPhase={displayedPhase}
              scale={scale}
              yScale={yScale}
              setDisplayedPhase={setDisplayedPhase}
              nestedLevels={nestedLevels}
              width={width}
            />
            <TimeIndicator
              ref={timeIndicatorRef}
              yScale={yScale}
              timelineWidth={width}
              scale={scale}
            />
            {missionOverview.capturetimes.map((capture, index) => (
              <ActivityCircle
                key={`${capture}-${index}`}
                capture={capture}
                yScale={yScale}
                marginLeft={margin.left}
                scale={scale}
              />
            ))}
            {missionOverview.milestones.map((milestone) => {
              const isSelected =
                displayedPhase.type === DisplayType.Milestone &&
                displayedPhase.data.name === milestone.name;

              return (
                <MileStonePolygon
                  key={milestone.date}
                  scale={scale}
                  yScale={yScale}
                  marginLeft={margin.left - paddingGraph.inner}
                  setDisplayedPhase={setDisplayedPhase}
                  milestone={milestone}
                  displayBorder={isSelected}
                />
              );
            })}
          </g>
          <TimeArrow
            timeIndicatorRef={timeIndicatorRef}
            svgRef={svgRef}
            fullWidth={width}
            margin={margin}
            onClick={() => centerTime()}
          />
        </g>
      </svg>
    </div>
  );
}