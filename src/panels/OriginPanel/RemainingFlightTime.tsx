import { useEffect } from 'react';
import { Box, Group, Text } from '@mantine/core';

import { useGetPropertyOwner } from '@/api/hooks';
import { AirplaneIcon } from '@/icons/icons';
import {
  subscribeToCameraPath,
  unsubscribeToCameraPath
} from '@/redux/camerapath/cameraPathMiddleware';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { IconSize } from '@/types/enums';
import { ScenePrefixKey } from '@/util/keys';

interface Props {
  compact?: boolean;
}

export function RemainingFlightTime({ compact = true }: Props) {
  const pathTargetNode = useAppSelector((state) => state.cameraPath.target);
  const pathTargetNodeName =
    useGetPropertyOwner(`${ScenePrefixKey}${pathTargetNode}`)?.name ?? pathTargetNode;
  const remainingTimeForPath = useAppSelector((state) => state.cameraPath.remainingTime);

  const dispatch = useAppDispatch();
  const cappedPathTargetNodeName = pathTargetNodeName.substring(0, 20);

  useEffect(() => {
    dispatch(subscribeToCameraPath());
    return () => {
      dispatch(unsubscribeToCameraPath());
    };
  }, [dispatch]);

  return (
    <>
      {compact ? (
        <Group wrap={'nowrap'} pr={'xs'}>
          <AirplaneIcon size={IconSize.lg} />
          <Box>
            <Text truncate>{cappedPathTargetNodeName}</Text>
            <Text>{remainingTimeForPath}</Text>
          </Box>
        </Group>
      ) : (
        <Group gap={'xs'}>
          <AirplaneIcon size={IconSize.md} />
          <Text>Flying to {cappedPathTargetNodeName}</Text>
          <Text>{remainingTimeForPath}</Text>
        </Group>
      )}
    </>
  );
}
