import { ActionIcon, Button, Popover, Text, Tooltip } from '@mantine/core';

import { InformationIcon, OpenInBrowserIcon } from '@/icons/icons';
import { SkyBrowserImage } from '@/types/skybrowsertypes';

interface Props {
  image: SkyBrowserImage;
}

export function ImageInfoPopover({ image }: Props) {
  return (
    <Popover width={200} position={'bottom'} withArrow shadow={'md'} trapFocus>
      <Popover.Target>
        <ActionIcon variant="outline" size={'xs'}>
          <InformationIcon />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <Text size={'sm'} fw={500}>
          {image.name}
        </Text>
        <Text size={'sm'} c={'dimmed'} lineClamp={10}>
          {image.credits}
        </Text>
        <Button
          component={'a'}
          size={'xs'}
          href={image.creditsUrl}
          target={'_blank'}
          variant={'outline'}
          mt={'md'}
        >
          <Text m={'xs'}>Read more</Text>
          <OpenInBrowserIcon size={16} />
        </Button>
      </Popover.Dropdown>
    </Popover>
  );
}
