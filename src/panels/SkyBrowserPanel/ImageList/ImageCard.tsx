import { ActionIcon, Card, Image, Text } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { AddPhotoIcon } from '@/icons/icons';
import { SkyBrowserImage } from '@/redux/skybrowser/skybrowserSlice';

import { useActiveImage, useSelectedBrowserColorString } from '../hooks';
import { ImageInfoPopover } from '../ImageInfoPopover';

interface Props {
  image: SkyBrowserImage;
}
export function ImageCard({ image }: Props) {
  const [activeImage, setActiveImage] = useActiveImage();
  const luaApi = useOpenSpaceApi();
  const isActive = activeImage === image.url;
  const color = useSelectedBrowserColorString();

  function select() {
    luaApi?.skybrowser.selectImage(image.url);
    setActiveImage(image.url);
  }

  return (
    <Card
      withBorder
      shadow={'sm'}
      style={{ borderColor: isActive ? color : 'var(--mantine-color-gray-8)' }}
    >
      <Card.Section>
        <Image src={image.thumbnail} height={45} fallbackSrc={'public/placeholder.svg'} />
      </Card.Section>
      <Card.Section p={'xs'}>
        <Text truncate={'end'}>{image.name}</Text>
        <ActionIcon mt={'xs'} mr={'md'} onClick={select}>
          <AddPhotoIcon />
        </ActionIcon>
        <ImageInfoPopover image={image} />
      </Card.Section>
    </Card>
  );
}
