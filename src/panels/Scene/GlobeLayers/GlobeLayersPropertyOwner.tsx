import {
  ColorPaletteIcon,
  LandscapeIcon,
  LayersIcon,
  NightIcon,
  WaterIcon
} from '@/icons/icons';
import { sgnIdentifierFromSubownerUri } from '@/util/propertyTreeHelpers';

import { GlobeLayerGroup } from './GlobeLayersGroup';

interface Props {
  uri: string;
}

export function GlobeLayersPropertyOwner({ uri }: Props) {
  const globeIdentifier = sgnIdentifierFromSubownerUri(uri);

  const groups = [
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

  return (
    <>
      {groups.map((group) => (
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
