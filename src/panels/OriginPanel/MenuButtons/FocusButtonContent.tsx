import { Stack, Text } from '@mantine/core';

import { useAnchorNode } from '@/util/propertyTreeHooks';

export function FocusButtonContent() {
  const anchorNode = useAnchorNode();

  return (
    <Stack gap={0} maw={130} ta={'start'}>
      <Text truncate>{anchorNode?.name}</Text>
      <Text fw={500} size={'xs'} c={'dimmed'}>
        Focus
      </Text>
    </Stack>
  );
}
