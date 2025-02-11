import { Button, Group, Stack, Text } from '@mantine/core';

import {
  useGetPropertyOwner,
  useGetStringPropertyValue,
  useOpenSpaceApi
} from '@/api/hooks';
import { AirplaneCancelIcon, AnchorIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';
import { NavigationAnchorKey, ScenePrefixKey } from '@/util/keys';

interface Props {
  capAnchorText?: boolean;
}
export function CancelFlightButton({ capAnchorText = true }: Props) {
  const [anchor] = useGetStringPropertyValue(NavigationAnchorKey);
  const anchorName = useGetPropertyOwner(`${ScenePrefixKey}${anchor}`)?.name ?? anchor;

  const cappedAnchorName = anchorName?.substring(0, 20) ?? '';

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
          <Text>{capAnchorText ? cappedAnchorName : anchorName}</Text>
          <Text>)</Text>
        </Group>
      </Stack>
    </Button>
  );
}
