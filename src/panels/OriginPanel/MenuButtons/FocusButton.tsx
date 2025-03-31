import { Skeleton, Stack, Text } from '@mantine/core';

import { FocusIcon } from '@/icons/icons';
import { TaskBarMenuButton } from '@/panels/Menu/TaskBar/TaskBarMenuButton';
import { IconSize } from '@/types/enums';

interface Props {
  anchorName: string | undefined;
  isOpenSpaceReady: boolean;
  id: string;
}

export function FocusButton({ anchorName, isOpenSpaceReady, id }: Props) {
  return (
    <TaskBarMenuButton
      id={id}
      disabled={!isOpenSpaceReady}
      leftSection={<FocusIcon size={IconSize.lg} />}
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
