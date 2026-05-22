import { useTranslation } from 'react-i18next';
import { Box } from '@mantine/core';

import { PropertyOwnerCollapsable } from '@/components/PropertyOwner/PropertyOwnerCollapsable';
import { layerGroups } from '@/data/GlobeLayers';
import { usePropertyOwner } from '@/hooks/propertyOwner';
import { Uri } from '@/types/types';
import { displayName } from '@/util/propertyTreeHelpers';
import { sgnIdentifierFromSubownerUri } from '@/util/uris';

import { GlobeLayerGroup } from './GlobeLayersGroup';

interface Props {
  uri: Uri;
  expandedOnDefault?: boolean;
}

/**
 * A custom component to render a Globe Layers property owner.
 */
export function GlobeLayersPropertyOwner({ uri, expandedOnDefault = false }: Props) {
  const { t } = useTranslation('panel-scene', { keyPrefix: 'globe-layer' });

  const propertyOwner = usePropertyOwner(uri);

  if (!propertyOwner) {
    throw Error(`${t('error.no-property-owner-for-uri')}: ${uri}`);
  }

  const globeIdentifier = sgnIdentifierFromSubownerUri(uri);

  return (
    <PropertyOwnerCollapsable
      uri={uri}
      title={displayName(propertyOwner)}
      expandedOnDefault={expandedOnDefault}
    >
      <Box my={5}>
        {layerGroups.map((group) => (
          <GlobeLayerGroup
            key={group.id}
            uri={`${uri}.${group.id}`}
            icon={group.icon}
            globe={globeIdentifier}
          />
        ))}
      </Box>
    </PropertyOwnerCollapsable>
  );
}
