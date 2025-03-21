import { Button, Group, Text } from '@mantine/core';

import { NodeNavigationButton } from '@/components/NodeNavigationButton/NodeNavigationButton';
import { PropertyOwnerVisibilityCheckbox } from '@/components/PropertyOwner/VisiblityCheckbox';
import { ThreePartHeader } from '@/components/ThreePartHeader/ThreePartHeader';
import { useGetPropertyOwner } from '@/hooks/propertyOwner';
import { useAppSelector } from '@/redux/hooks';
import { NavigationType } from '@/types/enums';
import { Uri } from '@/types/types';
import { displayName, sgnRenderableUri } from '@/util/propertyTreeHelpers';

import { SceneGraphNodeMoreMenu } from './SceneGraphNodeMoreMenu';

interface Props {
  uri: Uri;
  label?: string;
  onClick?: () => void;
  leftSection?: React.ReactNode; // If specified, replaces the checkbox if the node has an attached renderable
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
      h={'fit-content'}
      variant={'subtle'}
      p={0}
      size={'compact-sm'}
      onClick={onClick}
      justify={'start'}
      flex={1}
    >
      <Text mah={80} ta={'left'} style={{ textWrap: 'pretty', wordBreak: 'break-word' }}>
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
        <Group wrap={'nowrap'} gap={'xs'}>
          <NodeNavigationButton
            size={'sm'}
            type={NavigationType.Focus}
            variant={'subtle'}
            identifier={propertyOwner.identifier}
          />
          <SceneGraphNodeMoreMenu uri={uri} />
        </Group>
      }
    />
  );
}
