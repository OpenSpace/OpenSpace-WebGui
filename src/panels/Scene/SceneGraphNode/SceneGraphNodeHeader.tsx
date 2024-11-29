import { ActionIcon, Button, Flex, Group, UnstyledButton } from '@mantine/core';

import { PropertyOwnerVisibilityCheckbox } from '@/components/PropertyOwner/VisiblityCheckbox';
import { useAppSelector } from '@/redux/hooks';

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
    <Group
      justify={'space-between'}
      align={'start'}
      wrap={'nowrap'}
      style={{ boxSizing: 'border-box' }}
    >
      <Flex wrap={'nowrap'} align={'flex-start'} gap={'xs'}>
        {hasRenderable && <PropertyOwnerVisibilityCheckbox uri={renderableUri} />}
        {onClick ? (
          <UnstyledButton size={'xs'} onClick={onClick}>
            {name}
          </UnstyledButton>
        ) : (
          name
        )}
      </Flex>
      <div>
        <Flex wrap={'nowrap'}>
          <ActionIcon />
          <ActionIcon />
        </Flex>
      </div>
    </Group>
  );
}
