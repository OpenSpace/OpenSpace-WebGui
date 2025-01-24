import { ActionIcon, Button, Divider, Group, Menu } from '@mantine/core';

import { useGetPropertyOwner } from '@/api/hooks';
import { NodeNavigationButton } from '@/components/NodeNavigationButton/NodeNavigationButton';
import { OpenInNewIcon, VerticalDotsIcon } from '@/icons/icons';
import { IconSize, NavigationType } from '@/types/enums';
import { Uri } from '@/types/types';
import { displayName } from '@/util/propertyTreeHelpers';
import { useWindowLayoutProvider } from '@/windowmanagement/WindowLayout/hooks';

import { SceneGraphNodeView } from './SceneGraphNodeView';

interface Props {
  uri: Uri;
}

export function SceneGraphNodeMoreMenu({ uri }: Props) {
  const propertyOwner = useGetPropertyOwner(uri);
  const { addWindow } = useWindowLayoutProvider();

  if (!propertyOwner) {
    return <></>;
  }

  const name = displayName(propertyOwner);

  function openInNewWindow() {
    addWindow(<SceneGraphNodeView uri={uri} />, {
      id: 'sgn-' + uri,
      title: name,
      position: 'float'
    });
  }

  return (
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
  );
}
