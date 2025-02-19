import { Button, Group, Text } from '@mantine/core';

import { NodeNavigationButton } from '@/components/NodeNavigationButton/NodeNavigationButton';
import { FocusIcon } from '@/icons/icons';
import { IconSize, NavigationType } from '@/types/enums';
import { Identifier, PropertyOwner, PropertyValue } from '@/types/types';

interface FocusEntryProps {
  entry: PropertyOwner;
  activeNode: PropertyValue | undefined;
  onSelect: (
    identifier: Identifier,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  showNavigationButtons: boolean;
  showFrameButton?: boolean;
  disableFocus?: boolean;
}

export function FocusEntry({
  entry,
  activeNode,
  onSelect,
  showNavigationButtons,
  showFrameButton,
  disableFocus
}: FocusEntryProps) {
  const isActive = activeNode === entry.identifier;
  const buttonVariant = isActive ? 'filled' : 'light';

  function onSelectEntry(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    onSelect(entry.identifier, event);
  }

  return (
    <Group justify={'space-between'} gap={'xs'} w={'100%'}>
      <Button
        onClick={onSelectEntry}
        justify={'left'}
        flex={1}
        leftSection={<FocusIcon size={IconSize.sm} />}
        variant={buttonVariant}
        disabled={disableFocus}
        miw={70}
      >
        <Text truncate>{entry.name}</Text>
      </Button>
      {showNavigationButtons && (
        <Group gap={'xs'}>
          {showFrameButton && (
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
          <NodeNavigationButton
            type={NavigationType.Jump}
            identifier={entry.identifier}
            variant={buttonVariant}
            size={'lg'}
          />
        </Group>
      )}
    </Group>
  );
}
