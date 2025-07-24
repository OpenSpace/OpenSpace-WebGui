import { useTranslation } from 'react-i18next';
import { Group, Text } from '@mantine/core';

import { TruncatedText } from '@/components/TruncatedText/TruncatedText';
import { usePropertyOwner } from '@/hooks/propertyOwner';
import { useSubscribeToCameraPath } from '@/hooks/topicSubscriptions';
import { AirplaneIcon } from '@/icons/icons';
import styles from '@/theme/global.module.css';
import { IconSize } from '@/types/enums';
import { sgnUri } from '@/util/propertyTreeHelpers';

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
    <Group className={styles.blinking} wrap={'nowrap'} gap={'xs'} p={'xs'}>
      <AirplaneIcon style={{ flexShrink: 0 }} size={IconSize.lg} />
      {compact ? (
        <TruncatedText maw={130}>{pathTargetNodeName}</TruncatedText>
      ) : (
        <Text ta={'center'}>{t('flying-to', { target: pathTargetNodeName })}</Text>
      )}
      <Text style={{ textWrap: 'nowrap' }}>
        {t('remaining-time', { seconds: remainingTimeForPath })}
      </Text>
    </Group>
  );
}
