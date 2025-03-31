import { Group, Stack, Text } from '@mantine/core';

import { AnchorIcon, TelescopeIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';
import { useAimNode, useAnchorNode } from '@/util/propertyTreeHooks';

export function AnchorAimButtonContent() {
  const aimNode = useAimNode();
  const anchorNode = useAnchorNode();

  return (
    <Group>
      <Group gap={5} align={'center'}>
        <AnchorIcon size={IconSize.md} />
        <Stack gap={0} maw={130} ta={'start'}>
          <Text truncate>{anchorNode?.name}</Text>
          <Text fw={500} size={'xs'} c={'dimmed'}>
            Anchor
          </Text>
        </Stack>
      </Group>
      <Group gap={5}>
        <TelescopeIcon size={IconSize.md} />
        <Stack gap={0} maw={130} ta={'start'}>
          <Text truncate>{aimNode?.name}</Text>
          <Text fw={500} size={'xs'} c={'dimmed'}>
            Aim
          </Text>
        </Stack>
      </Group>
    </Group>
  );
}
