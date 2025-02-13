import { ActionIcon, Group, Paper, Slider, Stack, Text, Tooltip } from '@mantine/core';
import { useThrottledCallback } from '@mantine/hooks';

import { useOpenSpaceApi } from '@/api/hooks';
import { DeleteIcon, MoveTargetIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';
import { SkyBrowserImage } from '@/types/skybrowsertypes';

import { IconImage } from '../components/IconImage';
import { ImageInfoPopover } from '../components/ImageInfoPopover';
import { useActiveImage, useBrowserColorString } from '../hooks';

interface Props {
  image: SkyBrowserImage;
  selected: boolean;
  opacity: number;
}
export function AddedImageCard({ image, opacity }: Props) {
  const luaApi = useOpenSpaceApi();
  const [activeImage, setActiveImage] = useActiveImage();
  const selectedBrowserId = useAppSelector((state) => state.skybrowser.selectedBrowserId);
  const color = useBrowserColorString(selectedBrowserId);

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
          <Text size={'sm'} lineClamp={1}>
            {image.name}
          </Text>
        </Tooltip>
        <ImageInfoPopover image={image} />
      </Group>

      <Group wrap={'nowrap'} justify={'space-between'} align={'end'}>
        <IconImage
          url={image.thumbnail}
          icon={<MoveTargetIcon />}
          onClick={() => {
            luaApi?.skybrowser.selectImage(image.url);
            setActiveImage(image.url);
          }}
          bd={'1px solid var(--mantine-color-gray-7)'}
          radius={'sm'}
        />
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
        <ActionIcon
          color={'red'}
          variant={'outline'}
          onClick={() =>
            luaApi?.skybrowser.removeSelectedImageInBrowser(selectedBrowserId, image.url)
          }
        >
          <DeleteIcon />
        </ActionIcon>
      </Group>
    </Paper>
  );
}
