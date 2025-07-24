import { useTranslation } from 'react-i18next';
import { Group, Stack, Text } from '@mantine/core';

import { TruncatedText } from '@/components/TruncatedText/TruncatedText';
import { AnchorIcon, FocusIcon, TelescopeIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';
import { useAimNode, useAnchorNode } from '@/util/propertyTreeHooks';

export function NavigationPanelMenuButtonContent() {
  const { t } = useTranslation('panel-navigation', {
    keyPrefix: 'menu-button'
  });
  const aimNode = useAimNode();
  const anchorNode = useAnchorNode();
  const hasDistinctAim = aimNode && aimNode.identifier !== anchorNode?.identifier;

  // Anchor and aim
  if (hasDistinctAim) {
    return (
      <Group>
        <Group gap={5} align={'center'}>
          <AnchorIcon size={IconSize.md} />
          <Stack gap={0} maw={130} ta={'start'}>
            <TruncatedText>{anchorNode?.name}</TruncatedText>
            <Text fw={500} size={'xs'} c={'dimmed'}>
              {t('anchor')}
            </Text>
          </Stack>
        </Group>
        <Group gap={5}>
          <TelescopeIcon size={IconSize.md} />
          <Stack gap={0} maw={130} ta={'start'}>
            <TruncatedText>{aimNode?.name}</TruncatedText>
            <Text fw={500} size={'xs'} c={'dimmed'}>
              {t('aim')}
            </Text>
          </Stack>
        </Group>
      </Group>
    );
  }

  // Only anchor -> Focus button
  return (
    <Group>
      <FocusIcon size={IconSize.lg} />
      <Stack gap={0} maw={130} ta={'start'}>
        <TruncatedText>{anchorNode?.name}</TruncatedText>
        <Text fw={500} size={'xs'} c={'dimmed'}>
          {t('focus')}
        </Text>
      </Stack>
    </Group>
  );
}
