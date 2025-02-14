import { Box, Group, Text } from '@mantine/core';

import { useGetPropertyOwner, useSubscribeToCameraPath } from '@/api/hooks';
import { AirplaneIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';
import { ScenePrefixKey } from '@/util/keys';

interface Props {
  compact?: boolean;
}

export function RemainingFlightTimeIndicator({ compact = true }: Props) {
  const { target: pathTargetNode, remainingTime: remainingTimeForPath } =
    useSubscribeToCameraPath();

  const pathTargetNodeName =
    useGetPropertyOwner(`${ScenePrefixKey}${pathTargetNode}`)?.name ?? pathTargetNode;

  return compact ? (
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
  );
}
