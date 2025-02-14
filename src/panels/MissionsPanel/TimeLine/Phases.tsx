import { scaleLinear, ScaleTime } from 'd3';

import { DisplayedPhase, DisplayType, Phase } from '../types';

import { TimeLineConfig } from './config';
import { PhaseRectangle } from './PhaseRectangle';

interface Props {
  allPhasesNested: Phase[][];
  displayedPhase: DisplayedPhase;
  setDisplayedPhase: (phase: DisplayedPhase) => void;
  scale: number;
  yScale: ScaleTime<number, number, never>;
  width: number;
  nestedLevels: number;
}

export function Phases({
  allPhasesNested,
  displayedPhase,
  scale,
  yScale,
  setDisplayedPhase,
  width,
  nestedLevels
}: Props) {
  const { margin } = TimeLineConfig;
  const xScale = scaleLinear()
    .range([margin.left, width - margin.right])
    .domain([0, nestedLevels]);

  // Depth of nesting for phases
  let nestedLevel = 0;
  return (
    <>
      {allPhasesNested.map((nestedPhase, index) =>
        nestedPhase.map((phase) => {
          // We want to draw the displayed phase last so it appears "on top"
          // So skip if for now but keep the index which indicates the level
          if (
            displayedPhase.type === DisplayType.Phase &&
            displayedPhase.data.name === phase.name
          ) {
            nestedLevel = index;
            return null;
          }
          return (
            <PhaseRectangle
              key={`${phase.name}-${phase.timerange.start}-${phase.timerange.end}`}
              scale={scale}
              xScale={xScale}
              yScale={yScale}
              nestedLevels={nestedLevels}
              nestedLevel={index}
              setDisplayedPhase={setDisplayedPhase}
              phase={phase}
            />
          );
        })
      )}
      {/* Draw the selected phase so it appears on top */}
      {displayedPhase.type === DisplayType.Phase && (
        <PhaseRectangle
          scale={scale}
          xScale={xScale}
          yScale={yScale}
          nestedLevels={nestedLevels}
          nestedLevel={nestedLevel}
          setDisplayedPhase={setDisplayedPhase}
          phase={displayedPhase.data}
          showBorder={true}
        />
      )}
    </>
  );
}
