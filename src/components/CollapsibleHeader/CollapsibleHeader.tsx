import { Group } from '@mantine/core';

import { ChevronDownIcon, ChevronRightIcon } from '@/icons/icons';

interface Props {
  expanded: boolean;
  text: React.ReactNode;
}

export function CollapsibleHeader({ expanded, text }: Props) {
  const chevronProps = { size: 18, style: { flexShrink: 0 } };
  return (
    <Group gap={5} wrap={'nowrap'}>
      {expanded ? (
        <ChevronDownIcon {...chevronProps} />
      ) : (
        <ChevronRightIcon {...chevronProps} />
      )}
      {text}
    </Group>
  );
}
