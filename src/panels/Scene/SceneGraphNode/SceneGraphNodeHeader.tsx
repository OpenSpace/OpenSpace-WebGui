import { ActionIcon, Group, UnstyledButton } from '@mantine/core';

import { NodeNavigationButton } from '@/components/NodeNavigationButton/NodeNavigationButton';
import { PropertyOwnerVisibilityCheckbox } from '@/components/PropertyOwner/VisiblityCheckbox';
import { VerticalDotsIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';
import { NavigationType } from '@/types/enums';

interface Props {
  uri: string;
  onClick?: () => void;
}

export function SceneGraphNodeHeader({ uri, onClick }: Props) {
  const propertyOwner = useAppSelector((state) => {
    return state.propertyOwners.propertyOwners[uri];
  });

  const renderableUri = `${uri}.Renderable`;
  const hasRenderable = useAppSelector((state) => {
    return state.propertyOwners.propertyOwners[renderableUri] !== undefined;
  });

  const name = propertyOwner?.name ?? propertyOwner?.identifier;

  return (
    <Group justify={'space-between'} align={'start'} wrap={'nowrap'}>
      <Group wrap={'nowrap'} gap={'xs'} align={'start'} style={{ flexGrow: 1 }}>
        {hasRenderable && <PropertyOwnerVisibilityCheckbox uri={renderableUri} />}
        {onClick ? (
          <UnstyledButton style={{ flexGrow: 1 }} onClick={onClick}>
            {name}
          </UnstyledButton>
        ) : (
          name
        )}
      </Group>
      <Group wrap={'nowrap'} gap={1}>
        <NodeNavigationButton
          type={NavigationType.focus}
          identifier={propertyOwner?.identifier || ''}
          variant={'light'}
        />
        <ActionIcon size={'lg'} variant={'light'}>
          <VerticalDotsIcon />
        </ActionIcon>
      </Group>
    </Group>
  );
}
