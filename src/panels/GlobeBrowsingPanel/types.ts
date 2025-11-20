export type OpenSpaceCapabilities = Record<string, Capability>;

export interface Capability {
  Name: string;
  URL: string;
}

export interface OpenSpaceGlobeBrowsingNodes {
  firstIndexWithoutUrl: number;
  identifiers: Record<string, string>;
}

export interface GlobeBrowsingNodes {
  firstIndexWithoutUrl: number;
  identifiers: string[];
}

export interface UrlInfo {
  name: string; // Name of the WMS server
  url: string; //
}

export const layerTypes = [
  'ColorLayers',
  'NightLayers',
  'Overlays',
  'HeightLayers',
  'WaterMasks'
] as const;

export type LayerType = (typeof layerTypes)[number];
