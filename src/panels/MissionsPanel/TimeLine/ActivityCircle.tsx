import { Tooltip } from '@mantine/core';
import { ScaleTime } from 'd3';

import { useJumpToTime } from '../hooks';

interface Props {
  capture: string;
  yScale: ScaleTime<number, number, never>;
  marginLeft: number;
  scale: number;
}
export function ActivityCircle({ capture, yScale, marginLeft, scale }: Props) {
  const jumpToTime = useJumpToTime();
  const circleRadius = 3;

  return (
    <Tooltip label={'Instrument Activity'}>
      <ellipse
        cx={marginLeft - 5}
        cy={yScale(new Date(capture))}
        rx={circleRadius}
        ry={circleRadius / scale}
        fill={'yellow'}
        onClick={(event) => {
          if (event.shiftKey) {
            jumpToTime(capture);
          }
        }}
      />
    </Tooltip>
  );
}
