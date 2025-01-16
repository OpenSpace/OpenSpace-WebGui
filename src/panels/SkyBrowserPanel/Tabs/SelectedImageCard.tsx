import { TrashIcon } from '@/icons/icons';
import { ActionIcon, Group, Paper, Slider, Stack, Image, Text } from '@mantine/core';
import { ImageInfoPopover } from '../ImageInfoPopover';
import { SkyBrowserImage } from '@/redux/skybrowser/skybrowserSlice';

interface Props {
  image: SkyBrowserImage;
  selected: boolean;
}
export function SelectedImageCard({ image, selected }: Props) {
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
          <Slider />
        </Stack>
        <ActionIcon onClick={() => 'remove'}>
          <TrashIcon />
        </ActionIcon>
        <ImageInfoPopover image={image} />
      </Group>
    </Paper>
  );
}
