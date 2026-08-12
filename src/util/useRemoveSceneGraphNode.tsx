import { useTranslation } from 'react-i18next';
import { Group, Stack, Text } from '@mantine/core';
import { modals } from '@mantine/modals';

import { useOpenSpaceApi } from '@/api/hooks';
import { WarningIcon } from '@/components/WarningIcon/WarningIcon';
import { IconSize } from '@/types/enums';
import { Identifier } from '@/types/types';

export function useRemoveSceneGraphNodeModal() {
  const { t } = useTranslation('panel-scene', {
    keyPrefix: 'scene-graph-node.more-menu'
  });

  const luaApi = useOpenSpaceApi();

  // @TODO (2025-02-04, emmbr): Maybe include a list of which scene graph nodes will be
  // removed as well?
  function removeSceneGraphNode(
    identifier: Identifier,
    sgnName?: string,
    onRemove?: () => void
  ) {
    modals.openConfirmModal({
      title: t('delete-confirm-modal.title'),
      children: (
        <Stack>
          <Text>{t('delete-confirm-modal.are-you-sure')}:</Text>
          <Group gap={'xs'}>
            <Text fw={500} size={'lg'} style={{ wordBreak: 'break-word' }}>
              {sgnName ?? identifier}
            </Text>
            <Text>?</Text>
          </Group>{' '}
          <Group gap={'xs'} align={'center'} wrap={'nowrap'}>
            <WarningIcon size={'ms'} iconSize={IconSize.sm} />
            <Text mt={'xs'} size={'xs'}>
              {t('delete-confirm-modal.this-is-irreversible')}
            </Text>
          </Group>
        </Stack>
      ),
      labels: {
        confirm: t('delete-confirm-modal.remove-button'),
        cancel: t('delete-confirm-modal.cancel-button')
      },
      confirmProps: { color: 'red', variant: 'filled' },
      onConfirm: () => {
        if (luaApi) {
          luaApi.removeSceneGraphNode(identifier);
          onRemove?.();
        }
      }
    });
  }

  return removeSceneGraphNode;
}

export function useRemoveScreenSpaceRenderableModal() {
  const { t } = useTranslation('panel-screenspacerenderable', {
    keyPrefix: 'more-menu'
  });

  const luaApi = useOpenSpaceApi();

  return function removeScreenSpaceRenderable(
    identifier: Identifier,
    name?: string,
    onRemove?: () => void
  ) {
    modals.openConfirmModal({
      title: t('delete-confirm-modal.title'),
      children: (
        <Stack>
          <Text>{t('delete-confirm-modal.are-you-sure')}:</Text>
          <Group gap={'xs'}>
            <Text fw={500} size={'lg'} style={{ wordBreak: 'break-word' }}>
              {name ?? identifier}
            </Text>
            ?
          </Group>
        </Stack>
      ),
      labels: {
        confirm: t('delete-confirm-modal.remove-button'),
        cancel: t('delete-confirm-modal.cancel-button')
      },
      confirmProps: { color: 'red', variant: 'filled' },
      onConfirm: () => {
        if (luaApi) {
          luaApi.removeScreenSpaceRenderable(identifier);
          onRemove?.();
        }
      }
    });
  };
}
