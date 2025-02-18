import { Button, Stack, Text } from '@mantine/core';

import {
  useGetPropertyOwner,
  useGetStringPropertyValue,
  useOpenSpaceApi
} from '@/api/hooks';
import { AirplaneCancelIcon, AnchorIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';
import { NavigationAnchorKey, ScenePrefixKey } from '@/util/keys';

export function CancelFlightButton() {
  const [anchor] = useGetStringPropertyValue(NavigationAnchorKey);
  const anchorName = useGetPropertyOwner(`${ScenePrefixKey}${anchor}`)?.name ?? anchor;

  const luaApi = useOpenSpaceApi();

  function cancelFlight(): void {
    luaApi?.pathnavigation.stopPath();
  }

  return (
    <Button
      leftSection={<AirplaneCancelIcon size={IconSize.lg} />}
      onClick={cancelFlight}
      size={'xl'}
      variant={'filled'}
      color={'red'}
    >
      <Stack gap={0} ta={'start'}>
        Cancel
        <Text truncate maw={130}>
          <AnchorIcon /> {anchorName}
        </Text>
      </Stack>
    </Button>
  );
}
