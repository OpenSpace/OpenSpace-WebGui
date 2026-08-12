import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Divider, Group, Text, Title } from '@mantine/core';

import { ResizeableContent } from '@/components/ResizeableContent/ResizeableContent';
import { ScrollBox } from '@/components/ScrollBox/ScrollBox';
import { usePropertyOwner } from '@/hooks/propertyOwner';
import { Uri } from '@/types/types';
import { ScreenSpaceKey } from '@/util/keys';

import { AddModal } from './Add/AddModal';
import { ScreenSpaceRenderableListItem } from './ScreenSpaceRenderableListItem';
import { ScreenSpaceRenderableView } from './ScreenSpaceRenderableView';

export function ScreenSpaceRenderablePanel() {
  const { t } = useTranslation('panel-screenspacerenderable');

  const screenSpacePropertyOwner = usePropertyOwner(ScreenSpaceKey);

  const [selectedRenderable, setSelectedRenderable] = useState<Uri | null>(null);

  const renderables = screenSpacePropertyOwner?.subowners ?? [];

  return (
    <>
      <Group justify={'space-between'}>
        <Title order={2}>{t('added-slides.title')}</Title>
        <AddModal />
      </Group>
      <Divider my={'xs'} />

      {renderables.length === 0 ? (
        <Text>{t('added-slides.empty-slides')}</Text>
      ) : (
        <>
          <ResizeableContent defaultHeight={150}>
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
