import { useTranslation } from 'react-i18next';
import { ActionIcon, Box, Divider, Group, Tabs, Text } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { PropertyOwner } from '@/components/PropertyOwner/PropertyOwner';
import { usePropertyOwner } from '@/hooks/propertyOwner';
import { InsertPhotoIcon, MinusIcon, WebIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';
import { Uri } from '@/types/types';
import { ScreenSpaceKey } from '@/util/keys';

import { ImageTab } from './ImageTab';
import { WebpageTab } from './WebpageTab';

export function ScreenSpaceRenderablePanel() {
  const { t } = useTranslation('panel-screenspacerenderable');

  const luaApi = useOpenSpaceApi();
  const screenSpacePropertyOwner = usePropertyOwner(ScreenSpaceKey);

  const renderables = screenSpacePropertyOwner?.subowners ?? [];

  function removeSlide(uri: Uri) {
    const identifier = uri.split('.').pop();

    if (!identifier) {
      return;
    }

    luaApi?.removeScreenSpaceRenderable(identifier);
  }

  return (
    <>
      <Tabs defaultValue={'images'}>
        <Tabs.List>
          <Tabs.Tab value={'images'} leftSection={<InsertPhotoIcon size={IconSize.sm} />}>
            {t('image-input.tab-title')}
          </Tabs.Tab>
          <Tabs.Tab value={'web'} leftSection={<WebIcon size={IconSize.sm} />}>
            {t('website-input.tab-title')}
          </Tabs.Tab>
        </Tabs.List>

        <Box pt={'xs'}>
          <Tabs.Panel value={'images'}>
            <ImageTab />
          </Tabs.Panel>

          <Tabs.Panel value={'web'}>
            <WebpageTab />
          </Tabs.Panel>
        </Box>
      </Tabs>
      <Divider my={'xs'} />
      {renderables.length === 0 ? (
        <Text>{t('added-slides.empty-slides')}</Text>
      ) : (
        renderables.map((uri) => (
          <Group
            key={uri}
            gap={'xs'}
            my={'xs'}
            justify={'space-between'}
            wrap={'nowrap'}
            align={'top'}
          >
            <Box flex={1}>
              <PropertyOwner uri={uri} />
            </Box>
            <ActionIcon
              onClick={() => removeSlide(uri)}
              color={'red'}
              variant={'outline'}
              aria-label={`${t('added-slides.remove-slide-aria-label')}: ${uri})`}
            >
              <MinusIcon />
            </ActionIcon>
          </Group>
        ))
      )}
    </>
  );
}
