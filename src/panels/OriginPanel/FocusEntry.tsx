import { ActionIcon, Button, Group, Menu, Stack } from '@mantine/core';

import { NodeNavigationButton } from '@/components/NodeNavigationButton/NodeNavigationButton';
import { VerticalDotsIcon } from '@/icons/icons';
import { NavigationType } from '@/types/enums';
import { Identifier, PropertyOwner, PropertyValue } from '@/types/types';

interface FocusEntryProps {
  entry: PropertyOwner;
  activeNode: PropertyValue | undefined;
  onSelect: (
    identifier: Identifier,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  showNavigationButtons: boolean;
}

export function FocusEntry({
  entry,
  activeNode,
  onSelect,
  showNavigationButtons
}: FocusEntryProps) {
  const buttonVariant = isActive() ? 'filled' : 'light';

  function isActive() {
    return entry.identifier === activeNode;
  }

  function onSelectEntry(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    onSelect(entry.identifier, event);
  }

  return (
    <Group justify={'space-between'} gap={'xs'}>
      <Button
        onClick={onSelectEntry}
        justify={'left'}
        style={{ flexGrow: 1 }}
        variant={buttonVariant}
      >
        {entry.name}
      </Button>
      {showNavigationButtons && (
        <>
          {isActive() && (
            <NodeNavigationButton
              type={NavigationType.frame}
              identifier={entry.identifier}
            />
          )}
          <NodeNavigationButton
            type={NavigationType.fly}
            identifier={entry.identifier}
            variant={buttonVariant}
          />

          <Menu position={'right-start'}>
            <Menu.Target>
              <ActionIcon size={'lg'} variant={buttonVariant}>
                <VerticalDotsIcon />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>{entry.name}</Menu.Label>
              <Stack gap={'xs'}>
                <NodeNavigationButton
                  type={NavigationType.focus}
                  identifier={entry.identifier}
                  showLabel
                  justify={'flex-start'}
                />
                <NodeNavigationButton
                  type={NavigationType.fly}
                  identifier={entry.identifier}
                  showLabel
                  justify={'flex-start'}
                />
                <NodeNavigationButton
                  type={NavigationType.jump}
                  identifier={entry.identifier}
                  showLabel
                  justify={'flex-start'}
                />
                <NodeNavigationButton
                  type={NavigationType.frame}
                  identifier={entry.identifier}
                  showLabel
                  justify={'flex-start'}
                />
              </Stack>
            </Menu.Dropdown>
          </Menu>
        </>
      )}
    </Group>
  );
}
