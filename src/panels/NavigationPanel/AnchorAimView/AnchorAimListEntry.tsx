import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('panel-navigation', {
    keyPrefix: 'anchor-aim.anchor-aim-list-entry'
  });

  return (
    <Group gap={'xs'} key={node.identifier} {...styleProps}>
      <Text flex={1} truncate pl={'xs'}>
        {node.name}
      </Text>
      <Tooltip label={t('anchor-tooltip')} openDelay={600}>
        <ActionIcon
          aria-label={t('anchor-tooltip', node.name)}
          size={'lg'}
          variant={isCurrentAnchor ? 'filled' : 'default'}
          onClick={(event) => onSelectAnchor(node.identifier, event)}
          disabled={disabled}
        >
          <AnchorIcon />
        </ActionIcon>
      </Tooltip>
      <Tooltip label={t('aim-tooltip')} openDelay={600}>
        <ActionIcon
          aria-label={t('aim-tooltip', node.name)}
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
