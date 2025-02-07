import { memo, useCallback, useMemo } from 'react';

import { FilterList } from '@/components/FilterList/FilterList';
import { generateMatcherFunctionByKeys } from '@/components/FilterList/util';
import { LoadingBlocks } from '@/components/LoadingBlocks/LoadingBlocks';
import { SkyBrowserImage } from '@/redux/skybrowser/skybrowserSlice';
import { ImageCard } from './ImageCard';
import { useWindowSize } from '@/windowmanagement/Window/hooks';

interface Props {
  imageList: SkyBrowserImage[];
  noImagesText?: React.JSX.Element;
}

// Generic component for all the image lists
// Memoizing this as it is very expensive
export const ImageList = memo(function ImageList({
  imageList,
  noImagesText = <LoadingBlocks />
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

  const cardWidth = 150;
  const maxColumns = 10;
  const columns = Math.min(Math.floor(width / cardWidth), maxColumns);

  return imageList.length > 0 ? (
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
  ) : (
    noImagesText
  );
});
