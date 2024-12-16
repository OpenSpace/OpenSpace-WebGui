import {
  MdColorLens,
  MdLandscape,
  MdNightlight,
  MdOutlineLayers,
  MdWater
} from 'react-icons/md';

import { sgnIdentifierFromSubownerUri } from '@/util/propertyTreeHelpers';

import { GlobeLayerGroup } from './GlobeLayersGroup';

interface Props {
  uri: string;
}

export function GlobeLayersPropertyOwner({ uri }: Props) {
  const globeIdentifier = sgnIdentifierFromSubownerUri(uri);

  // TODO: Move icons to the icons file, once decided on the final set and if we use them
  const groups = [
    {
      id: 'ColorLayers',
      icon: <MdColorLens />
    },
    {
      id: 'HeightLayers',
      icon: <MdLandscape />
    },
    {
      id: 'NightLayers',
      icon: <MdNightlight />
    },
    {
      id: 'Overlays',
      icon: <MdOutlineLayers />
    },
    {
      id: 'WaterMasks',
      icon: <MdWater />
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
