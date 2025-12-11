export const layerTypes = [
  'ColorLayers',
  'NightLayers',
  'Overlays',
  'HeightLayers',
  'WaterMasks'
] as const;

export type LayerType = (typeof layerTypes)[number];

export interface LayerGroupData {
  id: LayerType;
  icon: React.JSX.Element;
  label: string;
}
