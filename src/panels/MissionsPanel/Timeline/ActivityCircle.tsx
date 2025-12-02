import { useTranslation } from 'react-i18next';
import { Tooltip } from '@mantine/core';
import { ScaleTime } from 'd3';

import { useJumpToTime } from '../hooks';

import { ActivityCircleConfig } from './config';

interface Props {
  capture: string;
  yScale: ScaleTime<number, number, never>;
  marginLeft: number;
  scale: number;
}
export function ActivityCircle({ capture, yScale, marginLeft, scale }: Props) {
  const { t } = useTranslation('panel-missions', { keyPrefix: 'timeline' });

  const jumpToTime = useJumpToTime();
  const { radius, color, xOffset } = ActivityCircleConfig;

  return (
    <Tooltip label={t('instrument-tooltip')}>
      <ellipse
        cx={marginLeft - xOffset}
        cy={yScale(new Date(capture))}
        rx={radius}
        ry={radius / scale}
        fill={color}
        onClick={(event) => {
          if (event.shiftKey) {
            jumpToTime(capture);
          }
        }}
      />
    </Tooltip>
  );
}
