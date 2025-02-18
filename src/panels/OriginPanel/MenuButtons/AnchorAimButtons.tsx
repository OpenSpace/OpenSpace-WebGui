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
    >
      <Group>
        <>
          <AnchorIcon size={IconSize.lg} />
          <Stack gap={0} maw={130} style={{ textAlign: 'start' }}>
            <Text truncate>{anchorName}</Text>
            <Text>Anchor</Text>
          </Stack>
        </>
        <>
          <TelescopeIcon size={IconSize.lg} />
          <Stack gap={0} maw={130} style={{ textAlign: 'start' }}>
            <Text truncate>{aimName}</Text>
            <Text>Aim</Text>
          </Stack>
        </>
      </Group>
    </Button>
  );
}
