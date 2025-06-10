import { useTranslation } from 'react-i18next';
import { Group, Text } from '@mantine/core';

import { usePropertyOwner } from '@/hooks/propertyOwner';
import { useSubscribeToCameraPath } from '@/hooks/topicSubscriptions';
import { AirplaneIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';
import { sgnUri } from '@/util/propertyTreeHelpers';

import classes from './RemainingFlightTimeIndicator.module.css';

interface Props {
  compact?: boolean;
}

export function RemainingFlightTimeIndicator({ compact = true }: Props) {
  const { t } = useTranslation('panel-navigation', {
    keyPrefix: 'remaining-flight-time-indicator'
  });

  const { target: pathTargetNode, remainingTime: remainingTimeForPath } =
    useSubscribeToCameraPath();

  const pathTargetNodeName =
    usePropertyOwner(sgnUri(pathTargetNode))?.name ?? pathTargetNode;

  return (
    <Group className={classes.blinking} wrap={'nowrap'} gap={'xs'} p={'xs'}>
      <AirplaneIcon style={{ flexShrink: 0 }} size={IconSize.lg} />
      {compact ? (
        <Text truncate maw={130}>
          {pathTargetNodeName}
        </Text>
      ) : (
        <Text ta={'center'}>{t('flying-to', { target: pathTargetNodeName })}</Text>
      )}
      <Text style={{ textWrap: 'nowrap' }}>
        {t('remaining-time', { seconds: remainingTimeForPath })}
      </Text>
    </Group>
  );
}
