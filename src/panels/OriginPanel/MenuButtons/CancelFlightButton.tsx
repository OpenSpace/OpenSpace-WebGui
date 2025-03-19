import { Button, Stack, Text } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { AnchorIcon, CancelIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';
import { useGetAnchorNode } from '@/util/propertyTreeHooks';

export function CancelFlightButton() {
  const anchorNode = useGetAnchorNode();
  const luaApi = useOpenSpaceApi();

  function cancelFlight(): void {
    luaApi?.pathnavigation.stopPath();
  }

  return (
    <Button
      leftSection={<CancelIcon size={IconSize.lg} />}
      onClick={cancelFlight}
      size={'xl'}
      variant={'light'}
      color={'red'}
    >
      <Stack gap={5} ta={'left'}>
        Cancel
        <Text size={'xs'} opacity={0.8} truncate maw={130}>
          <AnchorIcon /> {anchorNode?.name ?? 'No anchor'}
        </Text>
      </Stack>
    </Button>
  );
}
