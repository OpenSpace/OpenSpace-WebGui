import {
  ActionIcon,
  Group,
  Image,
  Paper,
  Slider,
  Stack,
  Text,
  Tooltip
} from '@mantine/core';
import { useThrottledCallback } from '@mantine/hooks';

import { useOpenSpaceApi } from '@/api/hooks';
import { MoveTargetIcon, DeleteIcon } from '@/icons/icons';
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
    <Paper
      withBorder
      p={'sm'}
      style={{
        borderColor: isSelected ? color : 'var(--mantine-color-gray-8)'
      }}
    >
      <Group w={'100%'} justify={'space-between'}>
        <Stack maw={'50%'}>
          <Text fw={600} lineClamp={1}>
            {image.name}
          </Text>
          <Group>
            <Tooltip label="Look at image">
              <ActionIcon
                onClick={() => {
                  luaApi?.skybrowser.selectImage(image.url);
                  setActiveImage(image.url);
                }}
              >
                <MoveTargetIcon />
              </ActionIcon>
            </Tooltip>
            <ImageInfoPopover image={image} />
            <Tooltip label="Remove image">
              <ActionIcon
                color={'red'}
                variant="outline"
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
        </Stack>
        <Stack gap={'xs'}>
          <Image
            fit={'cover'}
            src={image.thumbnail}
            radius={'sm'}
            height={45}
            opacity={opacity}
            fallbackSrc={'placeholder.svg'}
            bd={'1px solid var(--mantine-color-gray-7)'}
          />
          <Slider
            value={opacity}
            onChange={setOpacity}
            min={0}
            max={1}
            step={0.1}
            label={(value) => value.toFixed(1)}
          />
        </Stack>
      </Group>
    </Paper>
  );
}
