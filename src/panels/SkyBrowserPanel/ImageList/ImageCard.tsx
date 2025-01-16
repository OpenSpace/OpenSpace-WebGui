import { SkyBrowserImage } from '@/redux/skybrowser/skybrowserSlice';
import { Card, Image, Text, ActionIcon } from '@mantine/core';
import { AddPhotoIcon } from '@/icons/icons';
import { ImageInfoPopover } from '../ImageInfoPopover';
import { useActiveImage } from '../hooks';
interface Props {
  image: SkyBrowserImage;
}
export function ImageCard({ image }: Props) {
  const [activeImage, setActiveImage] = useActiveImage();
  const isActive = activeImage === image.url;
  console.log('render');
  return (
    <Card withBorder shadow="sm" style={{ borderColor: isActive ? 'red' : 'blue' }}>
      <Card.Section>
        <Image
          src={image.thumbnail}
          height={60}
          fallbackSrc="https://placehold.co/600x400?text=Placeholder"
        ></Image>
      </Card.Section>
      <Card.Section p={'xs'}>
        <Text lineClamp={1}>{image.name}</Text>
        <ActionIcon
          mt={'xs'}
          mr={'md'}
          onClick={() => console.log('Add image' + image.thumbnail)}
        >
          <AddPhotoIcon onClick={() => setActiveImage(image.url)} />
        </ActionIcon>
        <ImageInfoPopover image={image} />
      </Card.Section>
    </Card>
  );
}
