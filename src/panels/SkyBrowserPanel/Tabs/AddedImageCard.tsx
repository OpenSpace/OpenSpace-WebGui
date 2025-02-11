import {
  ActionIcon,
  Card,
  Group,
  Image,
  Paper,
  Slider,
  Stack,
  Text,
  ThemeIcon,
  Tooltip
} from '@mantine/core';
import { useThrottledCallback } from '@mantine/hooks';

import { useOpenSpaceApi } from '@/api/hooks';
import { DeleteIcon, MoveTargetIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';
import { SkyBrowserImage } from '@/types/skybrowsertypes';

import { useActiveImage, useSelectedBrowserColorString } from '../hooks';
import { ImageInfoPopover } from '../ImageInfoPopover';

interface Props {
  image: SkyBrowserImage;
  selected: boolean;
  opacity: number;
}
export function AddedImageCard({ image, opacity }: Props) {
  const luaApi = useOpenSpaceApi();
  const [activeImage, setActiveImage] = useActiveImage();
  const selectedBrowserId = useAppSelector((state) => state.skybrowser.selectedBrowserId);
  const color = useSelectedBrowserColorString();

  const setOpacity = useThrottledCallback(
    (newValue) =>
      luaApi?.skybrowser.setOpacityOfImageLayer(selectedBrowserId, image.url, newValue),
    250
  );
  const isSelected = activeImage === image.url;

  return (
    <Card
      withBorder
      style={{
        borderColor: isSelected ? color : 'var(--mantine-color-gray-8)'
      }}
    >
      <Card.Section>
        <Image
          src={image.thumbnail}
          radius={'sm'}
          fallbackSrc={'placeholder.svg'}
          bd={'1px solid var(--mantine-color-gray-7)'}
        />
        <ThemeIcon
          onClick={() => {
            luaApi?.skybrowser.selectImage(image.url);
            setActiveImage(image.url);
          }}
        >
          <MoveTargetIcon />
        </ThemeIcon>
      </Card.Section>
      <Stack>
        <Text fw={600} lineClamp={1}>
          {image.name}
        </Text>
        <ImageInfoPopover image={image} />
      </Stack>

      <Group>
        <Tooltip label={'Remove image'}>
          <ActionIcon
            color={'red'}
            variant={'outline'}
            onClick={() =>
              luaApi?.skybrowser.removeSelectedImageInBrowser(
                selectedBrowserId,
                image.url
              )
            }
          >
            <DeleteIcon />
          </ActionIcon>
        </Tooltip>
      </Group>
      <Stack gap={'xs'}>
        <Slider
          value={opacity}
          onChange={setOpacity}
          min={0}
          max={1}
          step={0.1}
          label={(value) => value.toFixed(1)}
        />
      </Stack>
    </Card>
  );
}
