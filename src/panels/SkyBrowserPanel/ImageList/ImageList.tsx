import { memo, useMemo } from 'react';

import { FilterList } from '@/components/FilterList/FilterList';
import { FilterListGrid } from '@/components/FilterList/FilterListGrid';
import { generateMatcherFunctionByKeys } from '@/components/FilterList/util';
import { SkyBrowserImage } from '@/redux/skybrowser/skybrowserSlice';

import { ImageCard } from './ImageCard';

interface Props {
  imageList: SkyBrowserImage[];
  noImagesText?: string;
}

// Memoizing this as it is very expensive
// Generic component for all the images
export const ImageList = memo(function ImageList({
  imageList,
  noImagesText = 'Loading'
}: Props) {
  const renderImageCard = useMemo(
    () => (image: SkyBrowserImage) => {
      return <ImageCard image={image} />;
    },
    []
  );

  const matcherFunc = useMemo(
    () => generateMatcherFunctionByKeys(['collection', 'name']),
    []
  );

  return imageList.length > 0 ? (
    <FilterList>
      <FilterList.InputField
        placeHolderSearchText={`Search ${imageList.length} image${imageList.length > 1 ? 's' : ''}...`}
      />
      <FilterListGrid<SkyBrowserImage>
        data={imageList}
        grid={true}
        estimateSize={145}
        gap={15}
        renderElement={renderImageCard}
        matcherFunc={matcherFunc}
        columns={6}
      />
    </FilterList>
  ) : (
    noImagesText
  );
});
