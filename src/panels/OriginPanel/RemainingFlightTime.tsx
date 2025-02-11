import { useEffect } from 'react';
import { Box, Group, Stack, Text } from '@mantine/core';

import { useGetPropertyOwner } from '@/api/hooks';
import { AirplaneIcon } from '@/icons/icons';
import {
  subscribeToCameraPath,
  unsubscribeToCameraPath
} from '@/redux/camerapath/cameraPathMiddleware';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { IconSize } from '@/types/enums';
import { ScenePrefixKey } from '@/util/keys';

export function RemainingFlightTime() {
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
    <Stack pr={'xs'}>
      <Group wrap={'nowrap'}>
        <AirplaneIcon size={IconSize.lg} />
        <Box>
          <Text truncate>{cappedPathTargetNodeName}</Text>
          <Text>{remainingTimeForPath}</Text>
        </Box>
      </Group>
    </Stack>
  );
}
