import { Button, Group, Text } from '@mantine/core';

import { useGetPropertyOwner } from '@/api/hooks';
import { NodeNavigationButton } from '@/components/NodeNavigationButton/NodeNavigationButton';
import { PropertyOwnerVisibilityCheckbox } from '@/components/PropertyOwner/VisiblityCheckbox';
import { ThreePartHeader } from '@/components/ThreePartHeader/ThreePartHeader';
import { useAppSelector } from '@/redux/hooks';
import { NavigationType } from '@/types/enums';
import { Uri } from '@/types/types';
import { displayName, sgnRenderableUri } from '@/util/propertyTreeHelpers';

import { SceneGraphNodeMoreMenu } from './SceneGraphNodeMoreMenu';

interface Props {
  uri: Uri;
  label?: string;
  onClick?: () => void;
}

export function SceneGraphNodeHeader({ uri, label, onClick }: Props) {
  const propertyOwner = useGetPropertyOwner(uri);

  const renderableUri = sgnRenderableUri(uri);
  const hasRenderable = useAppSelector((state) => {
    return state.propertyOwners.propertyOwners[renderableUri] !== undefined;
  });

  if (!propertyOwner) {
    return <></>;
  }

  const name = label ?? displayName(propertyOwner);

  return (
    <ThreePartHeader
      text={
        onClick ? (
          <Button
            style={{ flexGrow: 1 }}
            h={'fit-content'}
            variant={'transparent'}
            justify={'left'}
            p={0}
            size={'compact-sm'}
            onClick={onClick}
          >
            <Text
              mah={'80px'}
              style={{ whiteSpace: 'wrap', overflowWrap: 'anywhere', textAlign: 'left' }}
            >
              {name}
            </Text>
          </Button>
        ) : (
          name
        )
      }
      leftSection={
        hasRenderable && <PropertyOwnerVisibilityCheckbox uri={renderableUri} />
      }
      rightSection={
        <Group wrap={'nowrap'} gap={4}>
          <NodeNavigationButton
            size={'sm'}
            type={NavigationType.focus}
            identifier={propertyOwner.identifier}
          />
          <SceneGraphNodeMoreMenu uri={uri} />
        </Group>
      }
    />
  );
}
