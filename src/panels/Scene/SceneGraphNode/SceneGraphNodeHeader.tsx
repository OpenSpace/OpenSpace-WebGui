import { ActionIcon, Button, Divider, Group, Menu, UnstyledButton } from '@mantine/core';

import { NodeNavigationButton } from '@/components/NodeNavigationButton/NodeNavigationButton';
import { PropertyOwnerVisibilityCheckbox } from '@/components/PropertyOwner/VisiblityCheckbox';
import { ThreePartHeader } from '@/components/ThreePartHeader/ThreePartHeader';
import { OpenInNewIcon, VerticalDotsIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';
import { IconSize, NavigationType } from '@/types/enums';
import { displayName } from '@/util/propertyTreeHelpers';
import { useWindowLayoutProvider } from '@/windowmanagement/WindowLayout/hooks';

import { SceneGraphNodeView } from './SceneGraphNodeView';

interface Props {
  uri: string;
  label?: string;
  onClick?: () => void;
}

export function SceneGraphNodeHeader({ uri, label, onClick }: Props) {
  const propertyOwner = useAppSelector((state) => {
    return state.propertyOwners.propertyOwners[uri];
  });

  if (!propertyOwner) {
    throw Error(`No property owner found for uri: ${uri}`);
  }

  const renderableUri = `${uri}.Renderable`;
  const hasRenderable = useAppSelector((state) => {
    return state.propertyOwners.propertyOwners[renderableUri] !== undefined;
  });

  const name = label ?? displayName(propertyOwner!);

  const { addWindow } = useWindowLayoutProvider();
  function openInNewWindow() {
    const content = <SceneGraphNodeView uri={uri} />;
    addWindow(content, {
      id: 'sgn-' + uri,
      title: name,
      position: 'float'
    });
  }

  return (
    <ThreePartHeader
      text={
        onClick ? (
          <UnstyledButton style={{ flexGrow: 1 }} onClick={onClick}>
            {name}
          </UnstyledButton>
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
            identifier={propertyOwner?.identifier || ''}
          />
          <Menu position={'right-start'}>
            <Menu.Target>
              <ActionIcon size={'sm'} variant={'light'}>
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
      }
    />
  );
}
