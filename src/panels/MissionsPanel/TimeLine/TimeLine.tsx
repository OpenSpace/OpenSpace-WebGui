import { useEffect, useRef, useState } from 'react';
import { ActionIcon, Group } from '@mantine/core';
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

import { ZoomInIcon, ZoomOutIcon, ZoomOutMapIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';
import { DisplayType, IconSize } from '@/types/enums';
import { Phase } from '@/types/mission-types';

import { DisplayedPhase } from '../MissionContent';

import { ActivityCircle } from './ActivityCircle';
import { MileStonePolygon } from './MilestonePolygon';
import { PhaseRectangle } from './PhaseRectangle';
import { TimeArrow } from './TimeArrow';
import { TimeIndicator } from './TimeIndicator';

import './TimeLine.css';

interface TimeLineProps {
  allPhasesNested: Phase[][];
  displayedPhase: DisplayedPhase;
  missionOverview: Phase;
  setDisplayedPhase: (phase: DisplayedPhase) => void;
}

// TODO: rewrite D3.js usage using this guide? Makes everything more React-esque
// https://2019.wattenberger.com/blog/react-and-d3

export function TimeLine({
  allPhasesNested,
  displayedPhase,
  missionOverview,
  setDisplayedPhase
}: TimeLineProps) {
  const [scale, setScale] = useState(1);
  const [translation, setTranslation] = useState(0);
  const now = useAppSelector((state) => state.time.timeCapped);

  // TODO anden88: no idea how to type the ref here properly without 1000 errors later
  // const xAxisRef = useRef<any>(null);
  const yAxisRef = useRef<any>(null);
  const svgRef = useRef<any>(null);
  const zoomRef = useRef<ZoomBehavior<SVGElement, unknown> | null>(null);
  const timeIndicatorRef = useRef<SVGRectElement | null>(null);
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

  const timeRange = [
    new Date(missionOverview.timerange.start),
    new Date(missionOverview.timerange.end)
  ];
  const xScale = scaleLinear()
    .range([margin.left, width - margin.right])
    .domain([0, nestedLevels]);
  const yScale = scaleUtc([height - margin.bottom, margin.top]).domain(timeRange);

  // Calculate axes
  const yAxis = axisLeft(yScale);

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
  // TODO: these use Effects should fill their dependency arrays but if we do it with eg
  // yAxis its recomputed every time, so we need to do some memo? or somethign here
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

  function createPhases(): React.JSX.Element {
    let selectedPhase: Phase | undefined = undefined;
    let selectedPhaseIndex: number = 0;
    return (
      <>
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
            return (
              <PhaseRectangle
                key={`${phase.name}-${phase.timerange.start}-${phase.timerange.end}`}
                scale={scale}
                xScale={xScale}
                yScale={yScale}
                nestedLevels={nestedLevels}
                setDisplayedPhase={setDisplayedPhase}
                phase={phase}
                nestedLevel={index}
              />
            ); //createRectangle(phase, index);
          })
        )}
        {selectedPhase && (
          <>
            <PhaseRectangle
              scale={scale}
              xScale={xScale}
              yScale={yScale}
              nestedLevels={nestedLevels}
              setDisplayedPhase={setDisplayedPhase}
              phase={selectedPhase}
              nestedLevel={selectedPhaseIndex}
              padding={2}
              color={'white'}
            />
            <PhaseRectangle
              scale={scale}
              xScale={xScale}
              yScale={yScale}
              nestedLevels={nestedLevels}
              setDisplayedPhase={setDisplayedPhase}
              phase={selectedPhase}
              nestedLevel={selectedPhaseIndex}
            />
          </>
        )}
      </>
    );
  }

  return (
    <div style={{ flexGrow: 0 }}>
      <Group gap={0} justify={'space-between'}>
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
          mask: 'linear-gradient(transparent, black 5%, black 95%, transparent)'
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
            {createPhases()}

            <TimeIndicator
              ref={timeIndicatorRef}
              yScale={yScale}
              margin={margin}
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
