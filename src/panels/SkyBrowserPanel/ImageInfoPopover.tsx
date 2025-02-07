import { ActionIcon, Anchor, Popover, Text } from '@mantine/core';

import { InformationCircleOutlineIcon } from '@/icons/icons';
import { SkyBrowserImage } from '@/types/skybrowsertypes';

interface Props {
  image: SkyBrowserImage;
}

export function ImageInfoPopover({ image }: Props) {
  return (
    <Popover width={200} position={'bottom'} withArrow shadow={'md'} trapFocus>
      <Popover.Target>
        <ActionIcon>
          <InformationCircleOutlineIcon />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <Text size={'sm'} fw={500}>
          {image.name}
        </Text>
        <Text size={'sm'} c={'dimmed'} lineClamp={10}>
          {image.credits}
        </Text>
        <Anchor size={'sm'} href={image.creditsUrl} target={'_blank'} underline={'hover'}>
          Read more
        </Anchor>
      </Popover.Dropdown>
    </Popover>
  );
}
