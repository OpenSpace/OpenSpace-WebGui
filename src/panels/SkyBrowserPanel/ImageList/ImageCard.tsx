import { ActionIcon, Card, Image, Text, Tooltip } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { AddPhotoIcon, PlusIcon } from '@/icons/icons';
import { SkyBrowserImage } from '@/types/skybrowsertypes';

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
        <Image src={image.thumbnail} height={45} fallbackSrc={'placeholder.svg'} />
      </Card.Section>
      <Card.Section p={'xs'}>
        <Tooltip label={image.name}>
          <Text truncate={'end'}>{image.name}</Text>
        </Tooltip>
        <Tooltip label={'Add image'}>
          <ActionIcon mt={'xs'} mr={'md'} onClick={select}>
            <PlusIcon />
          </ActionIcon>
        </Tooltip>
        <Tooltip label={'Info'}>
          <ImageInfoPopover image={image} />
        </Tooltip>
      </Card.Section>
    </Card>
  );
}
