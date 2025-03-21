import { Button, Stack, Text } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { useStringProperty } from '@/hooks/properties';
import { usePropertyOwner } from '@/hooks/propertyOwner';
import { AnchorIcon, CancelIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';
import { NavigationAnchorKey } from '@/util/keys';
import { sgnUri } from '@/util/propertyTreeHelpers';

export function CancelFlightButton() {
  const [anchor] = useStringProperty(NavigationAnchorKey);
  const anchorName = usePropertyOwner(sgnUri(anchor))?.name ?? anchor;

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
          <AnchorIcon /> {anchorName}
        </Text>
      </Stack>
    </Button>
  );
}
