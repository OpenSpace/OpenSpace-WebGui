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

import { useSubscribeToTime } from '@/hooks/topicSubscriptions';
import { ZoomInIcon, ZoomOutIcon, ZoomOutMapIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';
import { useWindowSize } from '@/windowmanagement/Window/hooks';

import { DisplayedPhase, DisplayType, Phase } from '../types';

import { ActivityCircle } from './ActivityCircle';
import { TimeLineConfig } from './config';
import { MileStonePolygon } from './MilestonePolygon';
import { Phases } from './Phases';
import { TimeArrow } from './TimeArrow';
import { TimeIndicator } from './TimeIndicator';

import './TimeLine.css';

interface Props {
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
}: Props) {
  const [scale, setScale] = useState(1);
  const [translation, setTranslation] = useState(0);
  const now = useSubscribeToTime();

  const yAxisRef = useRef<SVGGElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const timeIndicatorRef = useRef<SVGRectElement | null>(null);
  const { height: windowHeight } = useWindowSize();

  const {
    minLevelWidth,
    margin,
    maxWidth,
    maxScale,
    paddingGraph,
    transitionDuration,
    defaultHeight,
    menuHeight
  } = TimeLineConfig;

  // Depth of nesting for phases
  const nestedLevels = allPhasesNested.length;

  // Ensure graph is large enough to show all phases
  const minWidth = minLevelWidth * nestedLevels + margin.left + margin.right;

  // Height of graph
  const height = Math.max(windowHeight - menuHeight, defaultHeight);

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

  useEffect(() => {
    if (yAxisRef.current) {
      select(yAxisRef.current).call(yAxis);
      // TODO set font family? Previously was 'Segoe UI' font on ticks
      select(yAxisRef.current).selectAll('.tick text').style('font-size', '1.3em');
    }
  }, [yAxis]);

  // Add zoom and update it every the the y scale changes
  useEffect(() => {
    // Min and max scale
    const scaleExtent: [number, number] = [1, maxScale];

    zoomRef.current = zoom<SVGSVGElement, unknown>()
      .on('zoom', (event) => {
        // TODO anden88: event is any here which is super annoying, try to find a way to get this
        // typed properly..
        const newYScale = event.transform.rescaleY(yScale);
        if (yAxisRef.current) {
          select(yAxisRef.current).call(yAxis.scale(newYScale));
        }
        setScale(event.transform.k);
        setTranslation(event.transform.y);
      })
      .scaleExtent(scaleExtent);
    if (svgRef.current && zoomRef.current) {
      select(svgRef.current).call(zoomRef.current);
    }
  }, [yScale, yAxis, maxScale, margin.bottom, width, height]);

  function reset() {
    if (!zoomRef.current || !svgRef.current) {
      return;
    }
    const node = select(svgRef.current).node();
    if (!node) {
      return;
    }
    select(svgRef.current)
      .transition()
      .duration(transitionDuration)
      .call(
        zoomRef.current.transform,
        zoomIdentity,
        zoomTransform(node).invert([width * 0.5, height * 0.5])
      );
  }

  function zoomByButton(zoomValue: number) {
    if (!zoomRef.current || !svgRef.current) {
      return;
    }
    select(svgRef.current)
      .transition()
      .duration(transitionDuration)
      .call(zoomRef.current.scaleBy, zoomValue);
  }

  function centerTime() {
    if (!now || !zoomRef.current || !svgRef.current) {
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
      <Group justify={'flex-end'} wrap={'nowrap'}>
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
            {now && (
              <TimeIndicator
                ref={timeIndicatorRef}
                yScale={yScale}
                timelineWidth={width}
                scale={scale}
                now={now}
              />
            )}
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
