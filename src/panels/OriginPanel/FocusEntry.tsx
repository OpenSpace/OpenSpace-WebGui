import { ActionIcon, Button, Group, Menu } from '@mantine/core';
import { PropertyOwner, PropertyValue } from 'src/types/types';

import { AirplaneIcon, FrameFocusIcon, VerticalDotsIcon } from '@/icons/icons';

interface FocusEntryProps {
  entry: PropertyOwner;
  activeNode: PropertyValue | undefined;
  onSelect: (
    identifier: string,
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
  function isActive() {
    return entry.identifier === activeNode;
  }

  function select(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    onSelect(entry.identifier, event);
  }

  return (
    <Group justify={'space-between'} gap={'xs'}>
      <Button
        onClick={select}
        justify={'left'}
        style={{ flexGrow: 1 }}
        variant={isActive() ? 'filled' : 'light'}
      >
        {entry.name}
      </Button>
      {showNavigationButtons && (
        <>
          {isActive() && (
            <ActionIcon onClick={() => console.log('Focus')} size={'lg'}>
              <FrameFocusIcon />
            </ActionIcon>
          )}
          <ActionIcon size={'lg'} variant={isActive() ? 'filled' : 'light'}>
            <AirplaneIcon />
          </ActionIcon>

          <Menu position={'right-start'}>
            <Menu.Target>
              <ActionIcon size={'lg'} variant={isActive() ? 'filled' : 'light'}>
                <VerticalDotsIcon />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>{entry.name}</Menu.Label>
              <Menu.Item>Focus</Menu.Item>
              <Menu.Item>Fly to</Menu.Item>
              <Menu.Item>Jump to</Menu.Item>
              <Menu.Item>Zoom to / Frame</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </>
      )}
    </Group>
  );
}
