import { useTranslation } from 'react-i18next';
import { ActionIcon, Button, Divider, Group, Menu, Stack, Text } from '@mantine/core';
import { modals } from '@mantine/modals';

import { useOpenSpaceApi } from '@/api/hooks';
import CopyUriButton from '@/components/CopyUriButton/CopyUriButton';
import { InfoBox } from '@/components/InfoBox/InfoBox';
import { NodeNavigationButton } from '@/components/NodeNavigationButton/NodeNavigationButton';
import { usePropertyOwner } from '@/hooks/propertyOwner';
import { DeleteIcon, OpenInNewIcon, VerticalDotsIcon } from '@/icons/icons';
import { IconSize, NavigationType } from '@/types/enums';
import { Uri } from '@/types/types';
import { displayName, identifierFromUri } from '@/util/propertyTreeHelpers';
import { useAnchorNode } from '@/util/propertyTreeHooks';
import { useWindowLayoutProvider } from '@/windowmanagement/WindowLayout/hooks';

import { SceneGraphNodeView } from './SceneGraphNodeView';

interface Props {
  uri: Uri;
}

export function SceneGraphNodeMoreMenu({ uri }: Props) {
  const { t: tCommon } = useTranslation('common');
  const { t } = useTranslation('panel-scene', {
    keyPrefix: 'scene-graph-node-more-menu'
  });
  const propertyOwner = usePropertyOwner(uri);
  const anchorNode = useAnchorNode();
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
      title: t('delete-confirm-modal.title'),
      children: (
        <Stack>
          <Text>{t('delete-confirm-modal.are-you-sure')}:</Text>
          <Text fw={500} size={'lg'}>
            {propertyOwner?.name}
          </Text>
          <Text mt={'xs'}>{t('delete-confirm-modal.this-is-irreversible')}</Text>
        </Stack>
      ),
      labels: { confirm: tCommon('remove'), cancel: tCommon('cancel') },
      confirmProps: { color: 'red', variant: 'filled' },
      onConfirm: () => remove()
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
          leftSection={<OpenInNewIcon size={IconSize.sm} />}
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
            disabled={anchorNode?.identifier === propertyOwner.identifier}
            onClick={onRemove}
            color={'red'}
            variant={'outline'}
            leftSection={<DeleteIcon />}
          >
            {tCommon('delete')}
          </Button>
          <>
            {anchorNode?.identifier === propertyOwner.identifier ? (
              <Text size={'sm'} c={'dimmed'} w={'100px'}>
                {t('delete-button.cannot-delete-current-focus')}
              </Text>
            ) : (
              <InfoBox>
                {t('delete-button.info')}
                <CopyUriButton uri={uri} />
              </InfoBox>
            )}
          </>
        </Group>
      </Menu.Dropdown>
    </Menu>
  );
}
