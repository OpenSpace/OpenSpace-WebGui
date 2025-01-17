import { TrashIcon } from '@/icons/icons';
import { ActionIcon, Group, Paper, Slider, Stack, Image, Text } from '@mantine/core';
import { ImageInfoPopover } from '../ImageInfoPopover';
import { SkyBrowserImage } from '@/redux/skybrowser/skybrowserSlice';
import { useOpenSpaceApi } from '@/api/hooks';
import { useAppSelector } from '@/redux/hooks';

interface Props {
  image: SkyBrowserImage;
  selected: boolean;
  opacity: number;
}
export function SelectedImageCard({ image, selected, opacity }: Props) {
  const luaApi = useOpenSpaceApi();
  const selectedBrowserId = useAppSelector((state) => state.skybrowser.selectedBrowserId);
  return (
    <Paper
      withBorder={true}
      my={'md'}
      py={'xs'}
      px={'md'}
      style={{ borderColor: selected ? 'pink' : 'blue' }}
    >
      <Group w={'100%'}>
        <Image
          src={image.thumbnail}
          radius={'sm'}
          fallbackSrc="https://placehold.co/600x400?text=Placeholder"
        />
        <Stack flex={1}>
          <Text fw={600}>{image.name}</Text>
          <Slider
            value={opacity}
            onChange={(newValue) =>
              luaApi?.skybrowser.setOpacityOfImageLayer(
                selectedBrowserId,
                image.url,
                newValue
              )
            }
            min={0}
            max={1}
            step={0.1}
            label={(value) => value.toFixed(1)}
          />
        </Stack>
        <ActionIcon onClick={() => 'remove'}>
          <TrashIcon />
        </ActionIcon>
        <ImageInfoPopover image={image} />
      </Group>
    </Paper>
  );
}
