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
      leftSection={<FocusIcon size={IconSize.lg} />}
      size={'xl'}
      variant={'menubar'}
    >
      <Stack gap={0} justify={'center'} maw={130} style={{ textAlign: 'start' }}>
        {!isOpenSpaceReady && <Skeleton>Anchor</Skeleton>}
        <Text truncate>{anchorName}</Text>
        <Text>Focus</Text>
      </Stack>
    </Button>
  );
}
