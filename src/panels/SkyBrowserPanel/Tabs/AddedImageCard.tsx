import { Group, Image, Paper, Slider, Stack, Text } from '@mantine/core';
import { useThrottledCallback } from '@mantine/hooks';

import { useOpenSpaceApi } from '@/api/hooks';
import { MoveTargetIcon, DeleteIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';
import { SkyBrowserImage } from '@/types/skybrowsertypes';

import { useActiveImage, useSelectedBrowserColorString } from '../hooks';
import { ImageInfoPopover } from '../ImageInfoPopover';

import { TabButton } from './TabButton';

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
            <TabButton
              onClick={() => {
                luaApi?.skybrowser.selectImage(image.url);
                setActiveImage(image.url);
              }}
              text={'Look at image'}
              variant={'filled'}
            >
              <MoveTargetIcon />
            </TabButton>
            <ImageInfoPopover image={image} />
            <TabButton
              onClick={() =>
                luaApi?.skybrowser.removeSelectedImageInBrowser(
                  selectedBrowserId,
                  image.url
                )
              }
              text={'Remove image'}
              variant={'outline'}
              color={'red'}
            >
              <DeleteIcon />
            </TabButton>
          </Group>
        </Stack>
        <Stack gap={'xs'}>
          <Image
            fit={'cover'}
            src={image.thumbnail}
            radius={'sm'}
            height={45}
            opacity={opacity}
            fallbackSrc={'public/placeholder.svg'}
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
