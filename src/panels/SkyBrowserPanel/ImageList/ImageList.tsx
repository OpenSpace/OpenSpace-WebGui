import { memo, useCallback, useMemo } from 'react';

import { FilterList } from '@/components/FilterList/FilterList';
import { generateMatcherFunctionByKeys } from '@/components/FilterList/util';
import { LoadingBlocks } from '@/components/LoadingBlocks/LoadingBlocks';
import { SkyBrowserImage } from '@/types/skybrowsertypes';
import { useWindowSize } from '@/windowmanagement/Window/hooks';

import { ImageCard } from './ImageCard';

interface Props {
  imageList: SkyBrowserImage[];
  noImagesDisplay?: React.JSX.Element;
}

// Generic component for all the image lists
// Memoizing this as it is very expensive
export const ImageList = memo(function ImageList({
  imageList,
  noImagesDisplay = <LoadingBlocks />
}: Props) {
  const { width } = useWindowSize();

  const renderImageCard = useCallback((image: SkyBrowserImage) => {
    return <ImageCard image={image} />;
  }, []);

  const matcherFunc = useMemo(
    () => generateMatcherFunctionByKeys(['collection', 'name']),
    []
  );

  const keyFunc = useCallback((image: SkyBrowserImage) => image.url, []);

  const cardWidth = 140;
  const maxColumns = 10;
  const columns = Math.max(Math.min(Math.floor(width / cardWidth), maxColumns), 1);

  if (imageList.length === 0) {
    return noImagesDisplay;
  }
  return (
    <FilterList>
      <FilterList.InputField
        placeHolderSearchText={`Search ${imageList.length} image${imageList.length > 1 ? 's' : ''}...`}
      />
      <FilterList.SearchResults>
        <FilterList.SearchResults.VirtualGrid<SkyBrowserImage>
          data={imageList}
          gap={15}
          renderElement={renderImageCard}
          matcherFunc={matcherFunc}
          columns={columns}
          keyFunc={keyFunc}
        />
      </FilterList.SearchResults>
    </FilterList>
  );
});
