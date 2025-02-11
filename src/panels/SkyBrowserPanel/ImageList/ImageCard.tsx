import { Card, Group, Image, Text, ThemeIcon, Tooltip } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { PlusIcon } from '@/icons/icons';
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
    <Card withBorder shadow={'sm'} style={{ borderColor: isActive ? color : undefined }}>
      <Card.Section role="button" onClick={select} style={{ cursor: 'pointer' }}>
        <Image src={image.thumbnail} fallbackSrc={'placeholder.svg'} />
        <ThemeIcon
          pos={'absolute'}
          top={0}
          right={0}
          variant="default"
          color="gray"
          size={'sm'}
        >
          <PlusIcon size={12} />
        </ThemeIcon>
      </Card.Section>
      <Card.Section p={'xs'}>
        <Group wrap="nowrap">
          <Tooltip label={image.name}>
            <Text truncate={'end'}>{image.name}</Text>
          </Tooltip>
          <ImageInfoPopover image={image} />
        </Group>
      </Card.Section>
    </Card>
  );
}
