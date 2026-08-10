import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Divider, Tabs, Text } from '@mantine/core';

import { DecoratedAddIcon } from '@/components/DecoratedIcon/DecoratedAddIcon';
import { ResizeableContent } from '@/components/ResizeableContent/ResizeableContent';
import { ScrollBox } from '@/components/ScrollBox/ScrollBox';
import { usePropertyOwner } from '@/hooks/propertyOwner';
import { InsertPhotoIcon, WebIcon } from '@/icons/icons';
import { Uri } from '@/types/types';
import { ScreenSpaceKey } from '@/util/keys';

import { ImageTab } from './ImageTab';
import { ScreenSpaceRenderableListItem } from './ScreenSpaceRenderableListItem';
import { ScreenSpaceRenderableView } from './ScreenSpaceRenderableView';
import { WebpageTab } from './WebpageTab';

export function ScreenSpaceRenderablePanel() {
  const { t } = useTranslation('panel-screenspacerenderable');

  const screenSpacePropertyOwner = usePropertyOwner(ScreenSpaceKey);

  const [selectedRenderable, setSelectedRenderable] = useState<Uri | null>(null);

  const renderables = screenSpacePropertyOwner?.subowners ?? [];

  return (
    <>
      <Tabs defaultValue={'images'}>
        <Tabs.List>
          <Tabs.Tab
            value={'images'}
            leftSection={<DecoratedAddIcon baseIcon={<InsertPhotoIcon />} />}
          >
            {t('image-input.tab-title')}
          </Tabs.Tab>
          <Tabs.Tab
            value={'web'}
            leftSection={<DecoratedAddIcon baseIcon={<WebIcon />} />}
          >
            {t('website-input.tab-title')}
          </Tabs.Tab>
        </Tabs.List>
        <Box>
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
        <>
          <ResizeableContent defaultHeight={200}>
            <ScrollBox h={'100%'}>
              {renderables.map((uri) => (
                <Box
                  mb={5}
                  key={uri}
                  pl={'xs'}
                  style={{
                    borderLeft:
                      selectedRenderable == uri
                        ? 'var(--openspace-border-active)'
                        : 'var(--openspace-border-active-placeholder)',
                    backgroundColor:
                      selectedRenderable == uri
                        ? 'var(--mantine-color-dark-7)'
                        : undefined
                  }}
                >
                  <ScreenSpaceRenderableListItem
                    uri={uri}
                    onClick={() =>
                      selectedRenderable == uri
                        ? setSelectedRenderable(null)
                        : setSelectedRenderable(uri)
                    }
                  />
                </Box>
              ))}
            </ScrollBox>
          </ResizeableContent>
          <Box pt={'xs'}>
            {selectedRenderable ? (
              <ScreenSpaceRenderableView uri={selectedRenderable} />
            ) : (
              <Text c={'dimmed'}>Select an item to view its details</Text>
            )}
          </Box>
        </>
      )}
    </>
  );
}
