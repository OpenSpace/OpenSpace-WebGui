import { ActionIcon, Group, UnstyledButton } from '@mantine/core';

import { ThreePartHeader } from '@/components/ThreePartHeader/ThreePartHeader';
import { ChevronDownIcon, ChevronRightIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';

import classes from './CollapsableHeader.module.css';

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
    <Group wrap={'nowrap'} gap={0} className={classes.header}>
      <ActionIcon variant={'transparent'} onClick={toggle}>
        {expanded ? (
          <ChevronDownIcon size={IconSize.xs} />
        ) : (
          <ChevronRightIcon size={IconSize.xs} />
        )}
      </ActionIcon>
      <ThreePartHeader
        title={
          <UnstyledButton onClick={toggle} tabIndex={-1} flex={1}>
            {title}
          </UnstyledButton>
        }
        leftSection={leftSection}
        rightSection={rightSection}
      />
    </Group>
  );
}
