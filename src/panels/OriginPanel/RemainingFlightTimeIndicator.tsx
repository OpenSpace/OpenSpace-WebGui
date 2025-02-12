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

export function RemainingFlightTimeIndicator({ compact = true }: Props) {
  const pathTargetNode = useAppSelector((state) => state.cameraPath.target);
  const pathTargetNodeName =
    useGetPropertyOwner(`${ScenePrefixKey}${pathTargetNode}`)?.name ?? pathTargetNode;
  const remainingTimeForPath = useAppSelector((state) => state.cameraPath.remainingTime);

  const dispatch = useAppDispatch();

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
            <Text truncate maw={130}>
              {pathTargetNodeName}
            </Text>
            <Text>{remainingTimeForPath} s</Text>
          </Box>
        </Group>
      ) : (
        <Group gap={'xs'}>
          <AirplaneIcon size={IconSize.md} />
          <Text>Flying to {pathTargetNodeName}</Text>
          <Text>{remainingTimeForPath} s</Text>
        </Group>
      )}
    </>
  );
}
