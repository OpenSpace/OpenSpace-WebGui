import { ActionIcon, Group, Text, Tooltip } from '@mantine/core';

import { AnchorIcon, TelescopeIcon } from '@/icons/icons';
import { Identifier, PropertyOwner } from '@/types/types';

interface Props {
  node: PropertyOwner;
  disabled: boolean;
  isCurrentAnchor: boolean;
  isCurrentAim: boolean;
  onSelectAnchor: (
    identifier: Identifier,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  onSelectAim: (
    identifier: Identifier,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
}

export function AnchorAimListEntry({
  node,
  disabled,
  isCurrentAnchor,
  isCurrentAim,
  onSelectAnchor,
  onSelectAim
}: Props) {
  return (
    <Group gap={'xs'} key={node.identifier}>
      <Text flex={1} truncate pl={'xs'}>
        {node.name}
      </Text>
      <Tooltip label={'Set and target anchor'} openDelay={600}>
        <ActionIcon
          aria-label={'Set anchor'}
          size={'lg'}
          variant={isCurrentAnchor ? 'filled' : 'light'}
          onClick={(event) => onSelectAnchor(node.identifier, event)}
          disabled={disabled}
        >
          <AnchorIcon />
        </ActionIcon>
      </Tooltip>
      <Tooltip label={'Set and target aim'} openDelay={600}>
        <ActionIcon
          aria-label={'Set aim'}
          size={'lg'}
          variant={isCurrentAim ? 'filled' : 'light'}
          onClick={(event) => onSelectAim(node.identifier, event)}
          disabled={disabled}
        >
          <TelescopeIcon />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
}
