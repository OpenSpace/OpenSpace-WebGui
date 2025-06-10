import { useTranslation } from 'react-i18next';
import { Button, Stack, Text } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { AnchorIcon, CancelIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';
import { useAnchorNode } from '@/util/propertyTreeHooks';

export function CancelFlightButton() {
  const { t: tCommon } = useTranslation('common');
  const { t } = useTranslation('panel-navigation', {
    keyPrefix: 'menu-button'
  });

  const anchorNode = useAnchorNode();
  const luaApi = useOpenSpaceApi();

  function cancelFlight(): void {
    luaApi?.pathnavigation.stopPath();
  }

  return (
    <Button
      leftSection={<CancelIcon size={IconSize.lg} />}
      onClick={cancelFlight}
      size={'xl'}
      variant={'light'}
      color={'red'}
    >
      <Stack gap={5} ta={'left'}>
        {tCommon('cancel')}
        <Text size={'xs'} opacity={0.8} truncate maw={130}>
          <AnchorIcon /> {anchorNode?.name ?? t('no-anchor')}
        </Text>
      </Stack>
    </Button>
  );
}
