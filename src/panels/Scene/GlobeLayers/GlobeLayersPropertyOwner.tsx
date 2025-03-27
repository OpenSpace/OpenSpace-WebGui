import {
  ColorPaletteIcon,
  LandscapeIcon,
  LayersIcon,
  NightIcon,
  WaterIcon
} from '@/icons/icons';
import { Uri } from '@/types/types';
import { sgnIdentifierFromSubownerUri } from '@/util/propertyTreeHelpers';

import { GlobeLayersGroup } from './GlobeLayersGroup';

const layerGroups = [
  {
    id: 'ColorLayers',
    icon: <ColorPaletteIcon />
  },
  {
    id: 'HeightLayers',
    icon: <LandscapeIcon />
  },
  {
    id: 'NightLayers',
    icon: <NightIcon />
  },
  {
    id: 'Overlays',
    icon: <LayersIcon />
  },
  {
    id: 'WaterMasks',
    icon: <WaterIcon />
  }
];

interface Props {
  uri: Uri;
}

export function GlobeLayersPropertyOwner({ uri }: Props) {
  const globeIdentifier = sgnIdentifierFromSubownerUri(uri);

  return (
    <>
      {layerGroups.map((group) => (
        <GlobeLayersGroup
          key={group.id}
          uri={`${uri}.${group.id}`}
          icon={group.icon}
          globe={globeIdentifier}
        />
      ))}
    </>
  );
}
