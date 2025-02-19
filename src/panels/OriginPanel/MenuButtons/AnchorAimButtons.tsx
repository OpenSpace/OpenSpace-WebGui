import { Button, Group, Stack, Text } from '@mantine/core';

import { AnchorIcon, TelescopeIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';

interface Props {
  anchorName: string | undefined;
  aimName: string | undefined;
  isOpenSpaceReady: boolean;
  onClick: () => void;
}
export function AnchorAimButtons({
  anchorName,
  aimName,
  isOpenSpaceReady,
  onClick
}: Props) {
  // TODO: make sure Button has a working label for screen readers since we have mixed
  // icons, text and other elements inside the button
  return (
    <Button
      onClick={onClick}
      size={'xl'}
      disabled={!isOpenSpaceReady}
      variant={'menubar'}
      px={'md'}
    >
      <Group>
        <Group gap={5} align={'center'}>
          <AnchorIcon size={IconSize.md} />
          <Stack gap={0} maw={130} ta={'start'}>
            <Text truncate>{anchorName}</Text>
            <Text fw={500} size={'xs'} c={'dimmed'}>
              Anchor
            </Text>
          </Stack>
        </Group>
        <Group gap={5}>
          <TelescopeIcon size={IconSize.md} />
          <Stack gap={0} maw={130} ta={'start'}>
            <Text truncate>{aimName}</Text>
            <Text fw={500} size={'xs'} c={'dimmed'}>
              Aim
            </Text>
          </Stack>
        </Group>
      </Group>
    </Button>
  );
}
