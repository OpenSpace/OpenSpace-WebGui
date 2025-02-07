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
  leftSection?: React.ReactNode;
}

export function SceneGraphNodeHeader({ uri, label, onClick, leftSection }: Props) {
  const propertyOwner = useGetPropertyOwner(uri);

  const renderableUri = sgnRenderableUri(uri);
  const hasRenderable = useAppSelector((state) => {
    return state.propertyOwners.propertyOwners[renderableUri] !== undefined;
  });

  if (!propertyOwner) {
    return <></>;
  }

  const name = label ?? displayName(propertyOwner);

  // This title button has a lot of styling related setting to control how it wraps when
  // the header is resized.
  const titleButton = (
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
  );

  return (
    <ThreePartHeader
      title={onClick ? titleButton : name}
      leftSection={
        leftSection ??
        (hasRenderable && <PropertyOwnerVisibilityCheckbox uri={renderableUri} />)
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
