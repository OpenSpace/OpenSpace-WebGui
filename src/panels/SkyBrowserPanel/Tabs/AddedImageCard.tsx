import {
  ActionIcon,
  Box,
  Group,
  Paper,
  Slider,
  Stack,
  Text,
  Tooltip
} from '@mantine/core';
import { useThrottledCallback } from '@mantine/hooks';

import { useOpenSpaceApi } from '@/api/hooks';
import { DeleteIcon, MoveTargetIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';
import { SkyBrowserImage } from '@/types/skybrowsertypes';

import { useActiveImage, useSelectedBrowserColorString } from '../hooks';
import { IconImage } from '../IconImage';
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
    <Paper
      withBorder
      style={{
        borderColor: isSelected ? color : 'var(--mantine-color-gray-8)'
      }}
      mr={'sm'}
      p={'xs'}
    >
      <Group justify={'space-between'} wrap={'nowrap'} mb={'xs'}>
        <Tooltip label={image.name}>
          <Text fw={600} lineClamp={1}>
            {image.name}
          </Text>
        </Tooltip>
        <ImageInfoPopover image={image} />
      </Group>

      <Group wrap={'nowrap'} justify={'space-between'}>
        <Box>
          <IconImage
            url={image.thumbnail}
            icon={<MoveTargetIcon />}
            onClick={() => {
              luaApi?.skybrowser.selectImage(image.url);
              setActiveImage(image.url);
            }}
            radius={'sm'}
          />
        </Box>
        <Stack flex={'1 1'} gap={0}>
          <Text c={'dimmed'} size={'sm'}>
            Opacity
          </Text>
          <Slider
            value={opacity}
            onChange={setOpacity}
            min={0}
            max={1}
            step={0.1}
            label={(value) => value.toFixed(1)}
          />
        </Stack>

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
    </Paper>
  );
}
