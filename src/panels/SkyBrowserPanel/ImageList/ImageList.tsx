import { FilterList } from '@/components/FilterList/FilterList';
import { FilterListGrid } from '@/components/FilterList/FilterListGrid';
import { generateMatcherFunctionByKeys } from '@/components/FilterList/util';
import { SkyBrowserImage } from '@/redux/skybrowser/skybrowserSlice';
import { Divider } from '@mantine/core';
import { ImageCard } from './ImageCard';
import { memo, useMemo } from 'react';

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
    <>
      <Divider my={'md'} />
      <FilterList height={'200px'}>
        <FilterListGrid<SkyBrowserImage>
          data={imageList}
          grid={true}
          estimateSize={145}
          gap={15}
          renderElement={renderImageCard}
          matcherFunc={matcherFunc}
          columns={3}
        />
      </FilterList>
    </>
  ) : (
    noImagesText
  );
});
