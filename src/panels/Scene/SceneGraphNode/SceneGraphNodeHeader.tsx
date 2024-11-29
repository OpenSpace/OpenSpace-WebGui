import { ActionIcon, Button, Divider, Group, Menu, UnstyledButton } from '@mantine/core';

import { NodeNavigationButton } from '@/components/NodeNavigationButton/NodeNavigationButton';
import { PropertyOwnerVisibilityCheckbox } from '@/components/PropertyOwner/VisiblityCheckbox';
import { OpenInNewIcon, VerticalDotsIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';
import { IconSize, NavigationType } from '@/types/enums';
import { useWindowManagerProvider } from '@/windowmanagement/WindowLayout/WindowLayoutProvider';

import { SceneGraphNode } from './SceneGraphNode';

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

  const name = propertyOwner?.name ?? propertyOwner?.identifier ?? uri;

  const { addWindow } = useWindowManagerProvider();
  function openInNewWindow() {
    const content = <SceneGraphNode uri={uri} />;
    addWindow(content, {
      id: 'sgn-' + uri,
      title: name,
      position: 'float'
    });
  }

  if (!propertyOwner) {
    return null;
  }

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
      <Group wrap={'nowrap'} gap={4}>
        <NodeNavigationButton
          type={NavigationType.focus}
          identifier={propertyOwner?.identifier || ''}
        />
        <Menu position={'right-start'}>
          <Menu.Target>
            <ActionIcon size={'lg'} variant={'light'}>
              <VerticalDotsIcon />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>{name}</Menu.Label>
            <Button
              onClick={openInNewWindow}
              leftSection={<OpenInNewIcon size={IconSize.sm} />}
            >
              Pop out
            </Button>
            <Divider m={'xs'} />
            <Group gap={'xs'}>
              <NodeNavigationButton
                type={NavigationType.fly}
                identifier={propertyOwner.identifier}
                showLabel
              />
              <NodeNavigationButton
                type={NavigationType.jump}
                identifier={propertyOwner.identifier}
                showLabel
              />
            </Group>
            <Group gap={'xs'}>
              <NodeNavigationButton
                type={NavigationType.frame}
                identifier={propertyOwner.identifier}
                showLabel
              />
            </Group>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  );
}
