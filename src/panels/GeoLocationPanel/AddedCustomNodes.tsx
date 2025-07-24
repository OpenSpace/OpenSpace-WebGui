import { useTranslation } from 'react-i18next';
import { Text } from '@mantine/core';

import { SceneGraphNodeHeader } from '@/panels/Scene/SceneGraphNode/SceneGraphNodeHeader';
import { useAppSelector } from '@/redux/hooks';
import { GeoLocationGroupKey } from '@/util/keys';
import { identifierFromUri, sgnUri } from '@/util/propertyTreeHelpers';

export function AddedCustomNodes() {
  const groups = useAppSelector((state) => state.groups.groups);

  const geoLocationOwners = groups[GeoLocationGroupKey]?.propertyOwners.map((uri) =>
    identifierFromUri(uri)
  );
  const addedCustomNodes = geoLocationOwners ?? [];

  const { t } = useTranslation('panel-geolocation', {
    keyPrefix: 'added-custom-nodes'
  });

  if (addedCustomNodes.length === 0) {
    return <Text>{t('empty-nodes')}</Text>;
  }

  // @TODO: This should be replaced with a custom header component for geo locations
  return (
    <>
      {addedCustomNodes.map((identifier) => (
        <SceneGraphNodeHeader key={identifier} uri={sgnUri(identifier)} />
      ))}
    </>
  );
}
