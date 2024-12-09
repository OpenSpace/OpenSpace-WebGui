import { ActionIcon, Group, UnstyledButton } from '@mantine/core';

import { ChevronDownIcon, ChevronRightIcon } from '@/icons/icons';

import { ThreePartHeader } from '../ThreePartHeader/ThreeParthHeader';

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
  const iconProps = { style: { flexShrink: 0 } };
  return (
    <Group wrap={'nowrap'} gap={0} align={'start'}>
      <ActionIcon variant={'transparent'} onClick={toggle}>
        {expanded ? (
          <ChevronDownIcon {...iconProps} />
        ) : (
          <ChevronRightIcon {...iconProps} />
        )}
      </ActionIcon>
      <ThreePartHeader
        text={<UnstyledButton onClick={toggle}>{text}</UnstyledButton>}
        leftSection={leftSection}
        rightSection={rightSection}
      />
    </Group>
  );
}
