import { ActionIcon, Group, MantineStyleProps, Text, Tooltip } from '@mantine/core';

import { AnchorIcon, TelescopeIcon } from '@/icons/icons';
import { Identifier, PropertyOwner } from '@/types/types';

interface Props extends MantineStyleProps {
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
  onSelectAim,
  ...styleProps
}: Props) {
  return (
    <Group gap={'xs'} key={node.identifier} {...styleProps}>
      <Text flex={1} truncate pl={'xs'}>
        {node.name}
      </Text>
      <Tooltip label={'Set and target anchor'} openDelay={600}>
        <ActionIcon
          aria-label={`Set anchor to ${node.name}`}
          size={'lg'}
          variant={isCurrentAnchor ? 'filled' : 'default'}
          onClick={(event) => onSelectAnchor(node.identifier, event)}
          disabled={disabled}
        >
          <AnchorIcon />
        </ActionIcon>
      </Tooltip>
      <Tooltip label={'Set and target aim'} openDelay={600}>
        <ActionIcon
          aria-label={`Set aim to ${node.name}`}
          size={'lg'}
          variant={isCurrentAim ? 'filled' : 'default'}
          onClick={(event) => onSelectAim(node.identifier, event)}
          disabled={disabled}
        >
          <TelescopeIcon />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
}
