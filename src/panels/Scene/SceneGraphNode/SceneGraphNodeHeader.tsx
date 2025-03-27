import { ActionIcon, Button, Group, Text } from '@mantine/core';

import { NodeNavigationButton } from '@/components/NodeNavigationButton/NodeNavigationButton';
import { PropertyOwnerVisibilityCheckbox } from '@/components/PropertyOwner/VisiblityCheckbox';
import { ThreePartHeader } from '@/components/ThreePartHeader/ThreePartHeader';
import { usePropertyOwner } from '@/hooks/propertyOwner';
import { OpenInNewIcon } from '@/icons/icons';
import { NavigationType } from '@/types/enums';
import { Uri } from '@/types/types';
import { displayName, isRenderable } from '@/util/propertyTreeHelpers';
import { useWindowLayoutProvider } from '@/windowmanagement/WindowLayout/hooks';

import { SceneGraphNodeMoreMenu } from './SceneGraphNodeMoreMenu';
import { SceneGraphNodeView } from './SceneGraphNodeView';

interface Props {
  uri: Uri;
  onClick?: () => void;
  label?: string;
}

export function SceneGraphNodeHeader({ uri, onClick, label }: Props) {
  const propertyOwner = usePropertyOwner(uri);
  const { addWindow } = useWindowLayoutProvider();

  const renderableUri = propertyOwner?.subowners.find((uri) => isRenderable(uri));
  const hasRenderable = renderableUri !== undefined;

  if (!propertyOwner) {
    return <></>;
  }

  function openInNewWindow() {
    addWindow(<SceneGraphNodeView uri={uri} />, {
      id: 'sgn-' + uri,
      title: name,
      position: 'float'
    });
  }

  const name = label ?? displayName(propertyOwner);

  // This title button has a lot of styling related setting to control how it wraps when
  // the header is resized.
  const titleButton = (
    <Button
      fullWidth
      h={'fit-content'}
      variant={'subtle'}
      p={0}
      size={'compact-sm'}
      onClick={onClick}
      justify={'start'}
      flex={1}
    >
      <Text
        ta={'left'}
        style={{ textWrap: 'pretty', overflowWrap: 'anywhere', wordBreak: 'break-word' }}
        lineClamp={3}
      >
        {name}
      </Text>
    </Button>
  );

  return (
    <ThreePartHeader
      title={onClick ? titleButton : name}
      leftSection={
        hasRenderable && <PropertyOwnerVisibilityCheckbox uri={renderableUri} />
      }
      rightSection={
        <Group wrap={'nowrap'} gap={'xs'} flex={0}>
          <NodeNavigationButton
            size={'sm'}
            type={NavigationType.Focus}
            variant={'subtle'}
            identifier={propertyOwner.identifier}
          />
          <ActionIcon onClick={openInNewWindow} size={'sm'} flex={0}>
            <OpenInNewIcon />
          </ActionIcon>
          <SceneGraphNodeMoreMenu uri={uri} />
        </Group>
      }
    />
  );
}
