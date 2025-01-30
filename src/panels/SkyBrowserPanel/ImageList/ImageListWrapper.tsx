import { memo, useMemo, useState } from 'react';
import { Select } from '@mantine/core';

import { useAppSelector } from '@/redux/hooks';

import { ImageList } from './ImageList';
import { NearestImages } from './NearestImages';
import { ViewingMode } from './util';
import { ResizeableContent } from '@/components/ResizeableContent/ResizeableContent';
import { useWindowSize } from '@/windowmanagement/Window/hooks';

// Memoizing this as it doesn't have any props and it is very expensive
export const ImageListWrapper = memo(function ImageListSection() {
  const [value, setValue] = useState<string>(ViewingMode.allImages);
  const imageList = useAppSelector((state) => state.skybrowser.imageList);
  const { width } = useWindowSize();

  // These computations are expensive so memoizing them too
  const skySurveys = useMemo(
    () => imageList.filter((img) => !img.hasCelestialCoords),
    [imageList]
  );
  const allImages = useMemo(
    () => imageList.filter((img) => img.hasCelestialCoords),
    [imageList]
  );

  const columns = Math.min(Math.floor(width / 150), 6);

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
        {value === ViewingMode.nearestImages ? (
          <NearestImages columns={columns} />
        ) : (
          <ImageList
            imageList={value === ViewingMode.allImages ? allImages : skySurveys}
            columns={columns}
          />
        )}
      </ResizeableContent>
    </>
  );
});
