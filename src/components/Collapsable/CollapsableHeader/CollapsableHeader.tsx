import { ActionIcon, Group, Text, UnstyledButton } from '@mantine/core';

import { ThreePartHeader } from '@/components/ThreePartHeader/ThreePartHeader';
import { ChevronDownIcon, ChevronRightIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';

interface Props {
  expanded: boolean;
  title: React.ReactNode;
  toggle?: () => void;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
}

export function CollapsableHeader({
  expanded,
  title,
  toggle,
  leftSection,
  rightSection
}: Props) {
  return (
    <Group wrap={'nowrap'} gap={0}>
      <ActionIcon variant={'transparent'} onClick={toggle}>
        {expanded ? (
          <ChevronDownIcon size={IconSize.xs} />
        ) : (
          <ChevronRightIcon size={IconSize.xs} />
        )}
      </ActionIcon>
      <ThreePartHeader
        title={
          <UnstyledButton onClick={toggle} tabIndex={-1}>
            <Text style={{ textWrap: 'pretty' }}>{title}</Text>
          </UnstyledButton>
        }
        leftSection={leftSection}
        rightSection={rightSection}
      />
    </Group>
  );
}
