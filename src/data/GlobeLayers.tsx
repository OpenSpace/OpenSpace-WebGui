import {
  ColorPaletteIcon,
  LandscapeIcon,
  LayersIcon,
  NightIcon,
  WaterIcon
} from '@/icons/icons';
import { LayerGroupData } from '@/types/globeLayers';

export const layerGroups: LayerGroupData[] = [
  {
    id: 'ColorLayers',
    icon: <ColorPaletteIcon />,
    label: 'Color layer'
  },
  {
    id: 'HeightLayers',
    icon: <LandscapeIcon />,
    label: 'Height layer'
  },
  {
    id: 'NightLayers',
    icon: <NightIcon />,
    label: 'Night layer'
  },
  {
    id: 'Overlays',
    icon: <LayersIcon />,
    label: 'Overlay layer'
  },
  {
    id: 'WaterMasks',
    icon: <WaterIcon />,
    label: 'Water mask'
  }
];
