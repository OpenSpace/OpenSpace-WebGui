import { Card, Group, Text, Tooltip } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { PlusIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';
import { SkyBrowserImage } from '@/types/skybrowsertypes';

import { IconImage } from '../components/IconImage';
import { ImageInfoPopover } from '../components/ImageInfoPopover';
import { useActiveImage, useBrowserColorString } from '../hooks';

interface Props {
  image: SkyBrowserImage;
}
export function ImageCard({ image }: Props) {
  const [activeImage, setActiveImage] = useActiveImage();
  const luaApi = useOpenSpaceApi();
  const isActive = activeImage === image.url;
  const selectedBrowserId = useAppSelector((state) => state.skybrowser.selectedBrowserId);
  const color = useBrowserColorString(selectedBrowserId);

  function select() {
    luaApi?.skybrowser.selectImage(image.url);
    setActiveImage(image.url);
  }

  return (
    <Card withBorder shadow={'sm'} style={{ borderColor: isActive ? color : undefined }}>
      <Card.Section>
        <IconImage
          url={image.thumbnail}
          onClick={select}
          icon={<PlusIcon />}
          h={'100%'}
          w={'100%'}
        />
      </Card.Section>
      <Card.Section p={'xs'}>
        <Group wrap={'nowrap'}>
          <Tooltip label={image.name}>
            <Text truncate={'end'}>{image.name}</Text>
          </Tooltip>
          <ImageInfoPopover image={image} />
        </Group>
      </Card.Section>
    </Card>
  );
}
