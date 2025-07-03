import { useTranslation } from 'react-i18next';
import { ActionIcon, Button, Divider, Group, Menu, Stack, Text } from '@mantine/core';

import CopyUriButton from '@/components/CopyUriButton/CopyUriButton';
import { InfoBox } from '@/components/InfoBox/InfoBox';
import { NodeNavigationButton } from '@/components/NodeNavigationButton/NodeNavigationButton';
import { usePropertyOwner } from '@/hooks/propertyOwner';
import { DeleteIcon, OpenWindowIcon, VerticalDotsIcon } from '@/icons/icons';
import { IconSize, NavigationType } from '@/types/enums';
import { Uri } from '@/types/types';
import { displayName, identifierFromUri } from '@/util/propertyTreeHelpers';
import { useAnchorNode } from '@/util/propertyTreeHooks';
import { useRemoveSceneGraphNodeModal } from '@/util/useRemoveSceneGraphNode';
import { useWindowLayoutProvider } from '@/windowmanagement/WindowLayout/hooks';

import { SceneGraphNodeView } from './SceneGraphNodeView';

interface Props {
  uri: Uri;
}

export function SceneGraphNodeMoreMenu({ uri }: Props) {
  const propertyOwner = usePropertyOwner(uri);
  const anchorNode = useAnchorNode();
  const confirmRemoveSgn = useRemoveSceneGraphNodeModal();

  const { addWindow } = useWindowLayoutProvider();
  const { t } = useTranslation('panel-scene', {
    keyPrefix: 'scene-graph-node.more-menu'
  });

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
        <ActionIcon size={'sm'} aria-label={t('aria-label')}>
          <VerticalDotsIcon />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>{name}</Menu.Label>
        <Button
          onClick={openInNewWindow}
          variant={'filled'}
          leftSection={<OpenWindowIcon size={IconSize.sm} />}
        >
          {t('pop-out')}
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
          <Group gap={'xs'}>
            <NodeNavigationButton
              type={NavigationType.Frame}
              identifier={propertyOwner.identifier}
              showLabel
            />
          </Group>
        </Stack>
        <Divider m={'xs'} />
        <Group gap={'xs'}>
          <Button
            size={'sm'}
            disabled={anchorNode?.identifier === propertyOwner.identifier}
            onClick={() => confirmRemoveSgn(identifierFromUri(uri), propertyOwner.name)}
            color={'red'}
            variant={'outline'}
            leftSection={<DeleteIcon />}
          >
            {t('delete-button.label')}
          </Button>
          <InfoBox>
            {t('delete-button.info')}
            <CopyUriButton uri={uri} />
          </InfoBox>
          {anchorNode?.identifier === propertyOwner.identifier && (
            <Text size={'sm'} c={'dimmed'} m={'xs'} w={'100px'}>
              {t('delete-button.cannot-delete-current-focus')}
            </Text>
          )}
        </Group>
      </Menu.Dropdown>
    </Menu>
  );
}
