import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Group, Stack, Text, ThemeIcon } from '@mantine/core';

import { FilterList } from '@/components/FilterList/FilterList';
import { ResizeableContent } from '@/components/ResizeableContent/ResizeableContent';
import { usePropertyOwner } from '@/hooks/propertyOwner';
import { InsertPhotoIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';
import { propertyOwnerSelectors } from '@/redux/propertytree/propertyOwnerSlice';
import { Uri } from '@/types/types';
import { ScreenSpaceKey } from '@/util/keys';

import { AddModal } from './Add/AddModal';
import { ScreenSpaceRenderableListItem } from './ScreenSpaceRenderableListItem';
import { ScreenSpaceRenderableView } from './ScreenSpaceRenderableView';

export function ScreenSpaceRenderablePanel() {
  const { t } = useTranslation('panel-screenspacerenderable');
  const [selectedRenderable, setSelectedRenderable] = useState<Uri | null>(null);

  const screenSpacePropertyOwner = usePropertyOwner(ScreenSpaceKey);
  const propertyOwners = useAppSelector((state) =>
    propertyOwnerSelectors.selectEntities(state)
  );

  const renderables = screenSpacePropertyOwner?.subowners ?? [];

  function onItemClick(uri: Uri) {
    setSelectedRenderable((prevSelected) => (prevSelected === uri ? null : uri));
  }

  function renderListItem(uri: Uri) {
    return (
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
            selectedRenderable == uri ? 'var(--mantine-color-dark-7)' : undefined
        }}
      >
        <ScreenSpaceRenderableListItem uri={uri} onClick={() => onItemClick(uri)} />
      </Box>
    );
  }

  return (
    <>
      <FilterList>
        <Group preventGrowOverflow={false} justify={'space-between'}>
          <Box flex={1}>
            <FilterList.InputField
              placeHolderSearchText={t('added-slides.search-placeholder')}
            />
          </Box>
          <AddModal />
        </Group>

        {renderables.length === 0 ? (
          // @TODO: Replace with Mantine's EmptyState component when library is updated
          <Stack h={'100%'} w={'100%'} align={'center'} p={'lg'}>
            <ThemeIcon size={70} variant={'transparent'} c={'dimmed'}>
              <InsertPhotoIcon size={'100%'} />
            </ThemeIcon>
            <Text ta={'center'} c={'dimmed'}>
              {t('added-slides.empty')}
            </Text>
            <Text ta={'center'} c={'dimmed'}>
              {t('added-slides.tips')}
            </Text>
          </Stack>
        ) : (
          <>
            <ResizeableContent defaultHeight={150}>
              <FilterList.Favorites>
                {renderables.map((uri) => renderListItem(uri))}
              </FilterList.Favorites>

              <FilterList.SearchResults
                data={renderables}
                renderElement={renderListItem}
                matcherFunc={(uri: Uri, searchString: string) =>
                  propertyOwners[uri]?.name
                    .toLowerCase()
                    .includes(searchString.toLowerCase())
                }
              >
                <FilterList.SearchResults.VirtualList gap={'xs'} />
              </FilterList.SearchResults>
            </ResizeableContent>

            <Box>
              {selectedRenderable ? (
                <ScreenSpaceRenderableView uri={selectedRenderable} />
              ) : (
                <Text c={'dimmed'}>{t('no-selection-hint')}</Text>
              )}
            </Box>
          </>
        )}
      </FilterList>
    </>
  );
}
