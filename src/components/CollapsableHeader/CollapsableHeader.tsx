import { ActionIcon, Group, UnstyledButton } from '@mantine/core';

import { ChevronDownIcon, ChevronRightIcon } from '@/icons/icons';

interface Props {
  expanded: boolean;
  text: React.ReactNode;
  toggle?: () => void;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
}

export function CollapsableHeader({
  expanded,
  text,
  toggle,
  leftSection,
  rightSection
}: Props) {
  const iconProps = { size: 18, style: { flexShrink: 0 } };
  return (
    <Group justify={'space-between'}>
      <Group gap={5} wrap={'nowrap'}>
        <ActionIcon variant={'transparent'} onClick={toggle}>
          {expanded ? (
            <ChevronDownIcon {...iconProps} />
          ) : (
            <ChevronRightIcon {...iconProps} />
          )}
        </ActionIcon>
        {leftSection && leftSection}
        <UnstyledButton onClick={toggle}>{text}</UnstyledButton>
      </Group>

      {rightSection && rightSection}
    </Group>
  );
}
