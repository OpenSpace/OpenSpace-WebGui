import { FilterList } from '@/components/FilterList/FilterList';
import { FilterListData } from '@/components/FilterList/FilterListData';
import { generateMatcherFunctionByKeys } from '@/components/FilterList/util';
import { useAppSelector } from '@/redux/hooks';
import { SkyBrowserImage } from '@/redux/skybrowser/skybrowserSlice';
import { Grid, Image, Text } from '@mantine/core';

export function ImageList() {
  const imageList = useAppSelector((state) => state.skybrowser.imageList);

  return (
    <FilterList height={'400px'}>
      <Grid>
        <FilterListData<SkyBrowserImage>
          data={imageList}
          renderElement={(image) => (
            <Grid.Col span={4} key={image.key}>
              <Image
                src={image.thumbnail}
                radius="md"
                h={100}
                fallbackSrc="https://placehold.co/600x400?text=Placeholder"
                onClick={() => console.log(image.thumbnail)}
              ></Image>
              <Text>{image.name}</Text>
            </Grid.Col>
          )}
          matcherFunc={generateMatcherFunctionByKeys(['collection', 'name'])}
        ></FilterListData>
      </Grid>
    </FilterList>
  );
}
