import { FilterList } from '@/components/FilterList/FilterList';
import { FilterListGrid } from '@/components/FilterList/FilterListGrid';
import { generateMatcherFunctionByKeys } from '@/components/FilterList/util';
import { useAppSelector } from '@/redux/hooks';
import { SkyBrowserImage } from '@/redux/skybrowser/skybrowserSlice';
import { Select, Divider } from '@mantine/core';
import { ImageCard } from './ImageCard';
import { memo, useMemo, useState } from 'react';

// Memoizing this as it doesn't have any props and it is very expensive
export const ImageList = memo(function ImageList() {
  const imageList = useAppSelector((state) => state.skybrowser.imageList);
  const [value, setValue] = useState<string | null>('All Images');

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
      <Select
        data={['All Images', 'Images Within View', 'Sky Surveys']}
        value={value}
        onChange={setValue}
      />
      <Divider my={'md'} />
      <FilterList height={'700px'}>
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
    '...Loading image collection...'
  );
});
