import { Tooltip } from '@mantine/core';
import { ScaleTime } from 'd3';

import { useOpenSpaceApi } from '@/api/hooks';
import { useAppSelector } from '@/redux/hooks';

import { jumpToTime } from '../util';

interface Props {
  capture: string;
  yScale: ScaleTime<number, number, never>;
  marginLeft: number;
  scale: number;
}
export function ActivityCircle({ capture, yScale, marginLeft, scale }: Props) {
  const now = useAppSelector((state) => state.time.timeCapped);
  const luaApi = useOpenSpaceApi();
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
            jumpToTime(now, capture, luaApi);
          }
        }}
      />
    </Tooltip>
  );
}
