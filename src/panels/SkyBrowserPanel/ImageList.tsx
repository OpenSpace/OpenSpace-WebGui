import { FilterList } from '@/components/FilterList/FilterList';
import { FilterListData } from '@/components/FilterList/FilterListData';
import { generateMatcherFunctionByKeys } from '@/components/FilterList/util';
import { useAppSelector } from '@/redux/hooks';
import { SkyBrowserImage } from '@/redux/skybrowser/skybrowserSlice';
import { Card, Image, Text } from '@mantine/core';

export function ImageList() {
  const imageList = useAppSelector((state) => state.skybrowser.imageList);

  return (
    <FilterList height={'700px'}>
      <FilterListData<SkyBrowserImage>
        data={imageList}
        grid={true}
        estimateSize={135}
        renderElement={(image) => (
          <Card>
            <Card.Section>
              <Image
                src={image.thumbnail}
                height={60}
                fallbackSrc="https://placehold.co/600x400?text=Placeholder"
                onClick={() => console.log(image.thumbnail)}
              ></Image>
            </Card.Section>
            <Card.Section p={'xs'}>
              <Text lineClamp={1}>{image.name}</Text>
            </Card.Section>
          </Card>
        )}
        matcherFunc={generateMatcherFunctionByKeys(['collection', 'name'])}
      ></FilterListData>
    </FilterList>
  );
}
