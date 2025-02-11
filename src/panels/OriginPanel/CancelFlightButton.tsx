import { Button, Group, Stack, Text } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { AirplaneCancelIcon, AnchorIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';

interface Props {
  anchorName: string;
}

export function CancelFlightButton({ anchorName }: Props) {
  const luaApi = useOpenSpaceApi();

  function cancelFlight(): void {
    luaApi?.pathnavigation.stopPath();
  }

  return (
    <Button
      leftSection={<AirplaneCancelIcon size={IconSize.lg} />}
      onClick={cancelFlight}
      size={'xl'}
    >
      <Stack gap={0}>
        <Text>Cancel</Text>
        <Group gap={0}>
          <Text>(</Text>
          <AnchorIcon />
          <Text>{anchorName}</Text>
          <Text>)</Text>
        </Group>
      </Stack>
    </Button>
  );
}
