import { SkyBrowserImage } from '@/redux/skybrowser/skybrowserSlice';
import { Card, Image, Text, ActionIcon, Popover, Anchor, Button } from '@mantine/core';
import { AddPhotoIcon, InformationCircleOutlineIcon } from '@/icons/icons';
interface Props {
  image: SkyBrowserImage;
}
export function ImageCard({ image }: Props) {
  return (
    <Card withBorder shadow="sm">
      <Card.Section>
        <Image
          src={image.thumbnail}
          height={60}
          fallbackSrc="https://placehold.co/600x400?text=Placeholder"
        ></Image>
      </Card.Section>
      <Card.Section p={'xs'}>
        <Text lineClamp={1}>{image.name}</Text>
        <ActionIcon
          mt={'xs'}
          mr={'md'}
          onClick={() => console.log('Add image' + image.thumbnail)}
        >
          <AddPhotoIcon />
        </ActionIcon>
        <Popover width={200} position="bottom" withArrow shadow="md" trapFocus>
          <Popover.Target>
            <ActionIcon>
              <InformationCircleOutlineIcon />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown>
            <Text size="sm" fw={500}>
              {image.name}
            </Text>
            <Text size="sm" c={'dimmed'}>
              {image.credits}
            </Text>
            <Anchor size={'sm'} href={image.creditsUrl} target="_blank" underline="hover">
              Read more
            </Anchor>
          </Popover.Dropdown>
        </Popover>
      </Card.Section>
    </Card>
  );
}
