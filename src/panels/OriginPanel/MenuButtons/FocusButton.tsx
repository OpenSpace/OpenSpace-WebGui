import { Skeleton, Stack, Text } from '@mantine/core';

import { FocusIcon } from '@/icons/icons';
import { TaskBarMenuButton } from '@/panels/Menu/TaskBar/TaskBarMenuButton';
import { IconSize } from '@/types/enums';
import { MenuItemEventHandlers } from '@/types/types';

interface Props {
  anchorName: string | undefined;
  isOpenSpaceReady: boolean;
  eventHandlers: MenuItemEventHandlers;
  isOpen: boolean;
}

export function FocusButton({
  anchorName,
  isOpenSpaceReady,
  eventHandlers,
  isOpen
}: Props) {
  return (
    <TaskBarMenuButton
      {...eventHandlers}
      disabled={!isOpenSpaceReady}
      leftSection={<FocusIcon size={IconSize.lg} />}
      isOpen={isOpen}
    >
      <Stack gap={0} maw={130} ta={'start'}>
        {!isOpenSpaceReady && <Skeleton>Anchor</Skeleton>}
        <Text truncate>{anchorName}</Text>
        <Text fw={500} size={'xs'} c={'dimmed'}>
          Focus
        </Text>
      </Stack>
    </TaskBarMenuButton>
  );
}
