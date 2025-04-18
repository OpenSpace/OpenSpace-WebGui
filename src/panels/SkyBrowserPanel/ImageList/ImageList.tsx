import { memo, useCallback, useMemo } from 'react';
import { Group } from '@mantine/core';

import { FilterList } from '@/components/FilterList/FilterList';
import { useKeySettings } from '@/components/FilterList/SearchSettingsMenu/hook';
import { generateMatcherFunctionByKeys } from '@/components/FilterList/util';
import { useWindowSize } from '@/windowmanagement/Window/hooks';

import { SkyBrowserImage } from '../types';

import { ImageCard } from './ImageCard';

interface Props {
  imageList: SkyBrowserImage[];
  noImagesDisplay?: React.JSX.Element;
}

// Generic component for all the image lists
// Memoizing this as it is very expensive
export const ImageList = memo(function ImageList({ imageList, noImagesDisplay }: Props) {
  const { width } = useWindowSize();
  const { allowedKeys, toggleKey, selectedKeys } = useKeySettings<SkyBrowserImage>({
    collection: true,
    name: true
  });

  const renderImageCard = useCallback((image: SkyBrowserImage) => {
    return <ImageCard image={image} />;
  }, []);

  const matcherFunc = useMemo(
    () => generateMatcherFunctionByKeys(selectedKeys),
    [selectedKeys]
  );

  const cardWidth = 130;
  const maxColumns = 10;
  const columns = Math.max(Math.min(Math.floor(width / cardWidth), maxColumns), 1);

  return (
    <FilterList>
      <Group>
        <FilterList.InputField
          placeHolderSearchText={`Search ${imageList.length} image${imageList.length > 1 ? 's' : ''}...`}
        />
        <FilterList.SearchSettingsMenu keys={allowedKeys} setKey={toggleKey} />
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
