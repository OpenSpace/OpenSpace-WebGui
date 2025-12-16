import { Box } from '@mantine/core';

import { PropertyOwnerCollapsable } from '@/components/PropertyOwner/PropertyOwnerCollapsable';
import { layerGroups } from '@/data/GlobeLayers';
import { usePropertyOwner } from '@/hooks/propertyOwner';
import { Uri } from '@/types/types';
import { displayName, sgnIdentifierFromSubownerUri } from '@/util/propertyTreeHelpers';

import { GlobeLayerGroup } from './GlobeLayersGroup';

interface Props {
  uri: Uri;
  expandedOnDefault?: boolean;
}

/**
 * A custom component to render a Globe Layers property owner.
 */
export function GlobeLayersPropertyOwner({ uri, expandedOnDefault = false }: Props) {
  const propertyOwner = usePropertyOwner(uri);

  if (!propertyOwner) {
    throw Error(`No property owner found for uri: ${uri}`);
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
