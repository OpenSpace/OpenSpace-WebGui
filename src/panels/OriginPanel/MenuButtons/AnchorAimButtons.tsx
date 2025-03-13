import { Group, Stack, Text } from '@mantine/core';

import { AnchorIcon, TelescopeIcon } from '@/icons/icons';
import { TaskBarMenuButton } from '@/panels/Menu/TaskBar/TaskBarMenuButton';
import { IconSize } from '@/types/enums';
import { MenuItemEventHandlers } from '@/types/types';

interface Props {
  anchorName: string | undefined;
  aimName: string | undefined;
  isOpenSpaceReady: boolean;
  eventHandlers: MenuItemEventHandlers;
}

export function AnchorAimButtons({
  anchorName,
  aimName,
  isOpenSpaceReady,
  eventHandlers
}: Props) {
  // TODO: make sure Button has a working label for screen readers since we have mixed
  // icons, text and other elements inside the button
  return (
    <TaskBarMenuButton {...eventHandlers} disabled={!isOpenSpaceReady}>
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
    </TaskBarMenuButton>
  );
}
