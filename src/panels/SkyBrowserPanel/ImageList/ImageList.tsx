import { memo, useMemo } from 'react';

import { FilterList } from '@/components/FilterList/FilterList';
import { FilterListGrid } from '@/components/FilterList/FilterListGrid';
import { generateMatcherFunctionByKeys } from '@/components/FilterList/util';
import { SkyBrowserImage } from '@/redux/skybrowser/skybrowserSlice';

import { ImageCard } from './ImageCard';
import { useWindowSize } from '@/windowmanagement/Window/hooks';

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
  const { width } = useWindowSize();

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
  const columns = Math.min(Math.floor(width / 150), 6);

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
        columns={columns}
      />
    </FilterList>
  ) : (
    noImagesText
  );
});
