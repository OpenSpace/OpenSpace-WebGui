import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Group } from '@mantine/core';

import { FilterList } from '@/components/FilterList/FilterList';
import { useSearchKeySettings } from '@/components/FilterList/SearchSettingsMenu/hook';
import { generateMatcherFunctionByKeys } from '@/components/FilterList/util';
import { useWindowSize } from '@/windowmanagement/Window/hooks';

import { SkyBrowserImage } from '../types';

import { ImageCard } from './ImageCard';

interface Props {
  imageList: SkyBrowserImage[];
  noImagesDisplay?: React.ReactNode;
}

// Generic component for all the image lists
// Memoizing this as it is very expensive
export const ImageList = memo(function ImageList({ imageList, noImagesDisplay }: Props) {
  const { t } = useTranslation('panel-skybrowser', { keyPrefix: 'image-list' });

  const { width } = useWindowSize();
  const { allowedSearchKeys, toggleSearchKey, selectedSearchKeys } =
    useSearchKeySettings<SkyBrowserImage>({
      name: true,
      collection: true
    });

  const renderImageCard = useCallback(
    (image: SkyBrowserImage) => <ImageCard image={image} />,
    []
  );

  const matcherFunc = useMemo(
    () => generateMatcherFunctionByKeys(selectedSearchKeys),
    [selectedSearchKeys]
  );

  const cardWidth = 130;
  const maxColumns = 10;
  const columns = Math.max(Math.min(Math.floor(width / cardWidth), maxColumns), 1);

  return (
    <FilterList>
      <Group>
        <FilterList.InputField
          placeHolderSearchText={t('search-images-placeholder', {
            count: imageList.length
          })}
          flex={'auto'}
        />
        <FilterList.SearchSettingsMenu
          keys={allowedSearchKeys}
          setKey={toggleSearchKey}
        />
      </Group>
      <FilterList.SearchResults
        data={imageList}
        renderElement={renderImageCard}
        matcherFunc={matcherFunc}
        noResultsDisplay={noImagesDisplay}
      >
        <FilterList.SearchResults.VirtualGrid gap={'sm'} columns={columns} />
      </FilterList.SearchResults>
    </FilterList>
  );
});
