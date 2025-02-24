import { memo, useMemo, useState } from 'react';
import { Select } from '@mantine/core';

import { LoadingBlocks } from '@/components/LoadingBlocks/LoadingBlocks';
import { ResizeableContent } from '@/components/ResizeableContent/ResizeableContent';

import { useGetWwtImageCollection } from '../hooks';

import { ImageList } from './ImageList';
import { NearestImages } from './NearestImages';
import { ViewingMode } from './util';

// Memoizing this as it doesn't have any props and it is very expensive
export const ImageListWrapper = memo(function ImageListSection() {
  const [value, setValue] = useState<string>(ViewingMode.allImages);
  const [isPending, imageList] = useGetWwtImageCollection();

  // These computations are expensive so memoizing them too
  const skySurveys = useMemo(
    () => imageList.filter((img) => !img.hasCelestialCoords),
    [imageList]
  );
  const allImages = useMemo(
    () => imageList.filter((img) => img.hasCelestialCoords),
    [imageList]
  );

  return (
    <>
      <Select
        data={Object.values(ViewingMode)}
        value={value}
        onChange={(_, option) => setValue(option.value)}
        allowDeselect={false}
        mb={'md'}
      />
      <ResizeableContent defaultHeight={450}>
        {isPending ? (
          <LoadingBlocks />
        ) : value === ViewingMode.nearestImages ? (
          <NearestImages />
        ) : (
          <ImageList
            imageList={value === ViewingMode.allImages ? allImages : skySurveys}
          />
        )}
      </ResizeableContent>
    </>
  );
});
