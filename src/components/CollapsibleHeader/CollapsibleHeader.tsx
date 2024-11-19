import { Group } from '@mantine/core';
import { ActionIcon } from '@mantine/core';
import { ChevronDownIcon, ChevronRightIcon } from '@/icons/icons';

interface Props {
  expanded: boolean;
  text: React.ReactNode;
  toggle?: () => void;
}

export function CollapsibleHeader({ expanded, text, toggle }: Props) {
  const chevronProps = { size: 18, style: { flexShrink: 0 } };
  return (
    <Group gap={5} wrap={'nowrap'}>
      <ActionIcon onClick={toggle} variant={'transparent'}>
        {expanded ? (
          <ChevronDownIcon {...chevronProps} />
        ) : (
          <ChevronRightIcon {...chevronProps} />
        )}
      </ActionIcon>
      {text}
    </Group>
  );
}
