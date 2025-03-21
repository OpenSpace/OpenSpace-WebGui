import { Group, Text } from '@mantine/core';

import { useGetPropertyOwner } from '@/hooks/propertyOwner';
import { useSubscribeToCameraPath } from '@/hooks/topicSubscriptions';
import { AirplaneIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';
import { sgnUri } from '@/util/propertyTreeHelpers';

import classes from './RemainingFlightTimeIndicator.module.css';

interface Props {
  compact?: boolean;
}

export function RemainingFlightTimeIndicator({ compact = true }: Props) {
  const { target: pathTargetNode, remainingTime: remainingTimeForPath } =
    useSubscribeToCameraPath();

  const pathTargetNodeName =
    useGetPropertyOwner(sgnUri(pathTargetNode))?.name ?? pathTargetNode;

  return (
    <Group className={classes.blinking} wrap={'nowrap'} gap={'xs'} p={'xs'}>
      <AirplaneIcon style={{ flexShrink: 0 }} size={IconSize.lg} />
      {compact ? (
        <Text truncate maw={130}>
          {pathTargetNodeName}
        </Text>
      ) : (
        <Text ta={'center'}>Flying to {pathTargetNodeName}</Text>
      )}
      <Text style={{ textWrap: 'nowrap' }}>{remainingTimeForPath} s</Text>
    </Group>
  );
}
