import { layerGroups } from '@/data/GlobeLayers';
import { Uri } from '@/types/types';
import { sgnIdentifierFromSubownerUri } from '@/util/propertyTreeHelpers';

import { GlobeLayerGroup } from './GlobeLayersGroup';

interface Props {
  uri: Uri;
}

export function GlobeLayersPropertyOwner({ uri }: Props) {
  const globeIdentifier = sgnIdentifierFromSubownerUri(uri);

  return (
    <>
      {layerGroups.map((group) => (
        <GlobeLayerGroup
          key={group.id}
          uri={`${uri}.${group.id}`}
          icon={group.icon}
          globe={globeIdentifier}
        />
      ))}
    </>
  );
}
