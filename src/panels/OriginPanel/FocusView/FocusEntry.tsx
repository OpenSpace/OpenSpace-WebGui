import { Button, Group, MantineStyleProps, Text } from '@mantine/core';

import { NodeNavigationButton } from '@/components/NodeNavigationButton/NodeNavigationButton';
import { FocusIcon } from '@/icons/icons';
import { IconSize, NavigationType } from '@/types/enums';
import { Identifier, PropertyOwner } from '@/types/types';

interface Props extends MantineStyleProps {
  entry: PropertyOwner;
  onSelect: (
    identifier: Identifier,
    modifiers: { shiftKey: boolean; ctrlKey: boolean }
  ) => void;
  isActive?: boolean;
  showFrameButton?: boolean;
  disableFocus?: boolean;
}

export function FocusEntry({
  entry,
  onSelect,
  showFrameButton,
  isActive,
  disableFocus,
  ...props
}: Props) {
  function onSelectEntry(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    onSelect(entry.identifier, { shiftKey: event.shiftKey, ctrlKey: event.ctrlKey });
  }

  return (
    <Group justify={'space-between'} gap={'xs'} w={'100%'} {...props}>
      <Button
        onClick={onSelectEntry}
        justify={'left'}
        flex={1}
        leftSection={<FocusIcon size={IconSize.sm} />}
        variant={isActive ? 'filled' : 'default'}
        disabled={disableFocus}
        miw={70}
      >
        <Text truncate>{entry.name}</Text>
      </Button>

      <Group gap={'xs'}>
        {showFrameButton && (
          <NodeNavigationButton
            type={NavigationType.Frame}
            identifier={entry.identifier}
            size={'input-sm'}
          />
        )}
        <NodeNavigationButton
          type={NavigationType.Fly}
          identifier={entry.identifier}
          size={'input-sm'}
        />
        <NodeNavigationButton
          type={NavigationType.Jump}
          identifier={entry.identifier}
          size={'input-sm'}
        />
      </Group>
    </Group>
  );
}
