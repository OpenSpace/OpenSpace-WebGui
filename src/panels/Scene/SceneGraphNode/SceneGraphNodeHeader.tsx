import { ActionIcon, Button, Divider, Group, Menu, Text } from '@mantine/core';

import { useGetPropertyOwner } from '@/api/hooks';
import { NodeNavigationButton } from '@/components/NodeNavigationButton/NodeNavigationButton';
import { PropertyOwnerVisibilityCheckbox } from '@/components/PropertyOwner/VisiblityCheckbox';
import { ThreePartHeader } from '@/components/ThreePartHeader/ThreePartHeader';
import { OpenInNewIcon, VerticalDotsIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';
import { IconSize, NavigationType } from '@/types/enums';
import { Uri } from '@/types/types';
import { displayName } from '@/util/propertyTreeHelpers';
import { useWindowLayoutProvider } from '@/windowmanagement/WindowLayout/hooks';

import { SceneGraphNodeView } from './SceneGraphNodeView';

interface Props {
  uri: Uri;
  label?: string;
  onClick?: () => void;
}

export function SceneGraphNodeHeader({ uri, label, onClick }: Props) {
  const propertyOwner = useGetPropertyOwner(uri);

  const renderableUri = `${uri}.Renderable`;
  const hasRenderable = useAppSelector((state) => {
    return state.propertyOwners.propertyOwners[renderableUri] !== undefined;
  });

  const { addWindow } = useWindowLayoutProvider();

  if (!propertyOwner) {
    return <></>;
  }

  const name = label ?? displayName(propertyOwner);

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
