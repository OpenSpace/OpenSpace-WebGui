import { ActionIcon, Button, Group, Menu, Stack, Text } from '@mantine/core';

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
  disableFocus?: boolean;
}

export function FocusEntry({
  entry,
  activeNode,
  onSelect,
  showNavigationButtons,
  disableFocus
}: FocusEntryProps) {
  const buttonVariant = isActive() ? 'filled' : 'light';

  function isActive() {
    return entry.identifier === activeNode;
  }

  function onSelectEntry(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    onSelect(entry.identifier, event);
  }

  return (
    <Group justify={'space-between'} gap={'xs'} w={'100%'}>
      <Button
        onClick={onSelectEntry}
        justify={'left'}
        flex={1}
        variant={buttonVariant}
        disabled={disableFocus}
      >
        <Text truncate>{entry.name}</Text>
      </Button>
      {showNavigationButtons && (
        <>
          {isActive() && (
            <NodeNavigationButton
              type={NavigationType.Frame}
              variant={buttonVariant}
              identifier={entry.identifier}
              size={'lg'}
            />
          )}
          <NodeNavigationButton
            type={NavigationType.Fly}
            identifier={entry.identifier}
            variant={buttonVariant}
            size={'lg'}
          />

          <Menu position={'right-start'}>
            <Menu.Target>
              <ActionIcon size={'lg'}>
                <VerticalDotsIcon />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>{entry.name}</Menu.Label>
              <Stack gap={'xs'}>
                <NodeNavigationButton
                  type={NavigationType.Focus}
                  identifier={entry.identifier}
                  showLabel
                  justify={'flex-start'}
                  disabled={disableFocus}
                />
                <NodeNavigationButton
                  type={NavigationType.Fly}
                  identifier={entry.identifier}
                  showLabel
                  justify={'flex-start'}
                />
                <NodeNavigationButton
                  type={NavigationType.Jump}
                  identifier={entry.identifier}
                  showLabel
                  justify={'flex-start'}
                />
                <NodeNavigationButton
                  type={NavigationType.Frame}
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
