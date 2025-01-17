import { SkyBrowserImage } from '@/redux/skybrowser/skybrowserSlice';
import { Card, Image, Text, ActionIcon } from '@mantine/core';
import { AddPhotoIcon } from '@/icons/icons';
import { ImageInfoPopover } from '../ImageInfoPopover';
import { useActiveImage } from '../hooks';
import { useOpenSpaceApi } from '@/api/hooks';
interface Props {
  image: SkyBrowserImage;
}
export function ImageCard({ image }: Props) {
  const [activeImage, setActiveImage] = useActiveImage();
  const luaApi = useOpenSpaceApi();
  const isActive = activeImage === image.url;

  function select() {
    luaApi?.skybrowser.selectImage(image.url);
    setActiveImage(image.url);
  }

  return (
    <Card
      withBorder
      shadow="sm"
      style={{ borderColor: isActive ? 'pink' : 'var(--mantine-color-gray-8)' }}
    >
      <Card.Section>
        <Image
          src={image.thumbnail}
          height={45}
          fallbackSrc="https://placehold.co/600x400?text=Placeholder"
        ></Image>
      </Card.Section>
      <Card.Section p={'xs'}>
        <Text lineClamp={1}>{image.name}</Text>
        <ActionIcon mt={'xs'} mr={'md'} onClick={select}>
          <AddPhotoIcon />
        </ActionIcon>
        <ImageInfoPopover image={image} />
      </Card.Section>
    </Card>
  );
}
