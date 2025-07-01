import { useTranslation } from 'react-i18next';
import { Stack, Text } from '@mantine/core';
import { modals } from '@mantine/modals';

import { useOpenSpaceApi } from '@/api/hooks';
import { Identifier } from '@/types/types';

export function useRemoveSceneGraphNodeModal() {
  const luaApi = useOpenSpaceApi();
  const { t } = useTranslation('panel-scene', {
    keyPrefix: 'scene-graph-node.more-menu'
  });
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
          <Text fw={500} size={'lg'} style={{ wordBreak: 'break-word' }}>
            {sgnName ?? identifier}
          </Text>
          <Text mt={'xs'}>{t('delete-confirm-modal.this-is-irreversible')}</Text>
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
