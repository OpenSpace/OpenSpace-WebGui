import { ActionIcon, Button, Divider, Group, Menu, Stack, Text } from '@mantine/core';
import { modals } from '@mantine/modals';

import {
  useGetPropertyOwner,
  useGetStringPropertyValue,
  useOpenSpaceApi
} from '@/api/hooks';
import { InfoBox } from '@/components/InfoBox/InfoBox';
import { NodeNavigationButton } from '@/components/NodeNavigationButton/NodeNavigationButton';
import { DeleteIcon, OpenInNewIcon, VerticalDotsIcon } from '@/icons/icons';
import { IconSize, NavigationType } from '@/types/enums';
import { Uri } from '@/types/types';
import { NavigationAnchorKey } from '@/util/keys';
import { displayName, identifierFromUri } from '@/util/propertyTreeHelpers';
import { useWindowLayoutProvider } from '@/windowmanagement/WindowLayout/hooks';

import { SceneGraphNodeView } from './SceneGraphNodeView';

interface Props {
  uri: Uri;
}

export function SceneGraphNodeMoreMenu({ uri }: Props) {
  const propertyOwner = useGetPropertyOwner(uri);
  const [anchor] = useGetStringPropertyValue(NavigationAnchorKey);
  const luaApi = useOpenSpaceApi();

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

  function remove() {
    luaApi?.removeSceneGraphNode(identifierFromUri(uri));
  }

  function onRemove() {
    // @TODO (2025-02-04, emmbr): Maybe include a list of which scene graph nodes will be
    // removed as well?
    modals.openConfirmModal({
      title: 'Confirm action',
      children: (
        <Stack>
          <Text>Are you sure you want to remove the scene graph node:</Text>
          <Text size={'lg'}>{propertyOwner?.name}?</Text>
          <Text mt={'xs'}>
            This action is irreversible and will also remove all nodes in the scene tree
            that depend on this node!
          </Text>
        </Stack>
      ),
      labels: { confirm: 'Remove', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => remove()
    });
  }

  return (
    <Menu position={'right-start'}>
      <Menu.Target>
        <ActionIcon size={'sm'}>
          <VerticalDotsIcon />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>{name}</Menu.Label>
        <Button
          onClick={openInNewWindow}
          variant={'filled'}
          leftSection={<OpenInNewIcon size={IconSize.sm} />}
        >
          Pop out
        </Button>
        <Divider m={'xs'} />
        <Stack gap={'xs'}>
          <Group gap={'xs'}>
            <NodeNavigationButton
              type={NavigationType.Fly}
              identifier={propertyOwner.identifier}
              showLabel
            />
            <NodeNavigationButton
              type={NavigationType.Jump}
              identifier={propertyOwner.identifier}
              showLabel
            />
          </Group>
          <NodeNavigationButton
            type={NavigationType.Frame}
            identifier={propertyOwner.identifier}
            showLabel
          />
        </Stack>
        <Divider m={'xs'} />
        <Group>
          <Button
            size={'sm'}
            disabled={anchor === propertyOwner.identifier}
            onClick={onRemove}
            color={'red'}
            variant={'outline'}
            leftSection={<DeleteIcon />}
          >
            Delete
          </Button>
          <>
            {anchor === propertyOwner.identifier ? (
              <Text size={'sm'} c={'dimmed'} w={'100px'}>
                Cannot delete the current focus node
              </Text>
            ) : (
              <InfoBox
                text={
                  'Remove this scene graph node (and all its child nodes) from the scene'
                }
              />
            )}
          </>
        </Group>
      </Menu.Dropdown>
    </Menu>
  );
}
