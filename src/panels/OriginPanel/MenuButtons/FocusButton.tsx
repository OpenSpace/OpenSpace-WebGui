import { Button, Skeleton, Stack, Text } from '@mantine/core';

import { FocusIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';

interface Props {
  anchorName: string | undefined;
  isOpenSpaceReady: boolean;
  onClick: () => void;
}

export function FocusButton({ anchorName, isOpenSpaceReady, onClick }: Props) {
  return (
    <Button
      onClick={onClick}
      disabled={!isOpenSpaceReady}
      leftSection={<FocusIcon size={IconSize.md} />}
      size={'xl'}
      px={'md'}
      variant={'menubar'}
    >
      <Stack gap={0} maw={130} ta={'start'}>
        {!isOpenSpaceReady && <Skeleton>Anchor</Skeleton>}
        <Text truncate>{anchorName}</Text>
        <Text fw={500} size={'xs'} c={'dimmed'}>
          Focus
        </Text>
      </Stack>
    </Button>
  );
}
