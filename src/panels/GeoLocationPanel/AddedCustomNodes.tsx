import { useTranslation } from 'react-i18next';
import { ActionIcon, Group, Text } from '@mantine/core';

import { MinusIcon } from '@/icons/icons';
import { SceneGraphNodeHeader } from '@/panels/Scene/SceneGraphNode/SceneGraphNodeHeader';
import { useAppSelector } from '@/redux/hooks';
import { GeoLocationGroupKey } from '@/util/keys';
import { identifierFromUri, sgnUri } from '@/util/propertyTreeHelpers';
import { useAnchorNode } from '@/util/propertyTreeHooks';
import { useRemoveSceneGraphNodeModal } from '@/util/useRemoveSceneGraphNode';

export function AddedCustomNodes() {
  const groups = useAppSelector((state) => state.groups.groups);
  const anchor = useAnchorNode();
  const removeSceneGraphNode = useRemoveSceneGraphNodeModal();

  const geoLocationOwners = groups[GeoLocationGroupKey]?.propertyOwners.map((uri) =>
    identifierFromUri(uri)
  );
  const addedCustomNodes = geoLocationOwners ?? [];

  const { t } = useTranslation('panel-geolocation', {
    keyPrefix: 'added-custom-nodes'
  });

  return addedCustomNodes.length === 0 ? (
    <Text>{t('empty-nodes')}</Text>
  ) : (
    <>
      {addedCustomNodes.map((identifier) => (
        <Group key={identifier} wrap={'nowrap'} grow preventGrowOverflow={false}>
          <ActionIcon
            variant={'light'}
            size={'sm'}
            color={'red'}
            flex={0}
            onClick={() => removeSceneGraphNode(identifier, identifier)}
            aria-label={`${t('remove-node-aria-label')}: ${identifier}`}
            disabled={anchor?.identifier === identifier}
          >
            <MinusIcon />
          </ActionIcon>
          <SceneGraphNodeHeader uri={sgnUri(identifier)} />
        </Group>
      ))}
    </>
  );
}
