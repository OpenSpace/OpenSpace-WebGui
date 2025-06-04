import { useTranslation } from 'react-i18next';
import { Text, Tooltip } from '@mantine/core';
import { ScaleLinear, ScaleTime } from 'd3';

import { useAppSelector } from '@/redux/hooks';

import { useJumpToTime } from '../hooks';
import { DisplayedPhase, DisplayType, Phase } from '../types';

import { PhaseRectangleConfig } from './config';

interface Props {
  scale: number; // d3 scale 'k' value
  xScale: ScaleLinear<number, number, never>;
  yScale: ScaleTime<number, number, never>;
  nestedLevel: number;
  nestedLevels: number;
  setDisplayedPhase: (phase: DisplayedPhase) => void;
  phase: Phase;
  showBorder?: boolean;
}

export function PhaseRectangle({
  scale,
  xScale,
  yScale,
  nestedLevel,
  nestedLevels,
  setDisplayedPhase,
  phase,
  showBorder = false
}: Props) {
  const jumpToTime = useJumpToTime();
  const { t } = useTranslation('panel-missions');
  const { borderWidth, borderColor, radius, gap } = PhaseRectangleConfig;

  const startTime = new Date(phase.timerange.start);
  const endTime = new Date(phase.timerange.end);

  const isCurrent = useAppSelector((state) => {
    const now = state.time.timeCapped;
    if (!now) {
      return false;
    }
    const isBeforeEndTime = now < endTime.valueOf();
    const isAfterBeginning = now > startTime.valueOf();
    return isBeforeEndTime && isAfterBeginning;
  });

  function handleClick(shiftIsPressed: boolean) {
    setDisplayedPhase({ type: DisplayType.Phase, data: phase });
    if (shiftIsPressed) {
      jumpToTime(phase.timerange.start);
    }
  }

  // Make sure padding doesn't get stretched when zooming
  const borderWidthY = borderWidth / scale;
  const radiusY = radius / scale; // same here

  const x = xScale(nestedLevels - nestedLevel - 1);
  const y = yScale(endTime);
  const height = yScale(startTime) - yScale(endTime);
  const width = xScale(1) - xScale(0) - gap;

  return (
    <Tooltip.Floating
      label={
        <>
          <Text fw={'bold'}>{t('phase')}</Text>
          {phase.name}
        </>
      }
    >
      <g>
        {/* To create a border we draw a larger rectangle behind the other */}
        {showBorder && (
          <rect
            x={x - borderWidth}
            y={y - borderWidthY}
            height={height + 2 * borderWidthY}
            width={width + 2 * borderWidth}
            ry={radiusY}
            rx={radius}
            style={{ fill: borderColor }}
          />
        )}
        <rect
          x={x}
          y={y}
          height={height}
          width={width}
          onClick={(evt) => handleClick(evt.shiftKey)}
          ry={radiusY}
          rx={radius}
          className={isCurrent ? 'highlightedRect' : 'normalRect'}
        />
      </g>
    </Tooltip.Floating>
  );
}
