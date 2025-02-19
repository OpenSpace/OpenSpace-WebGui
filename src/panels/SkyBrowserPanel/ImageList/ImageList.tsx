import { memo, useCallback, useMemo } from 'react';
import { Text } from '@mantine/core';

import { FilterList } from '@/components/FilterList/FilterList';
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

  const renderImageCard = useCallback((image: SkyBrowserImage) => {
    return <ImageCard image={image} />;
  }, []);

  const matcherFunc = useMemo(
    () => generateMatcherFunctionByKeys(['collection', 'name']),
    []
  );

  const cardWidth = 130;
  const maxColumns = 10;
  const columns = Math.max(Math.min(Math.floor(width / cardWidth), maxColumns), 1);

  if (imageList.length === 0) {
    return noImagesDisplay ?? <Text>No images found, try another search!</Text>;
  }
  return (
    <FilterList>
      <FilterList.InputField
        placeHolderSearchText={`Search ${imageList.length} image${imageList.length > 1 ? 's' : ''}...`}
      />
      <FilterList.SearchResults
        data={imageList}
        renderElement={renderImageCard}
        matcherFunc={matcherFunc}
      >
        <FilterList.SearchResults.VirtualGrid gap={'sm'} columns={columns} />
      </FilterList.SearchResults>
    </FilterList>
  );
});
