// anden88 2025-02-13: Incomplete type objects for the ArcGIS object we request for
// GeoLocationPanel. This was to avoid having to import the entire ArcGIS core since the
// @types file is deprecated on npm.
export interface ArcGISJSON {
  candidates: Candidate[];
  spatialReference: object;
}

export interface Candidate {
  address: string;
  attributes: {
    LongLabel: string;
  };
  extent: Extent;
  location: Location;
}

export interface Location {
  x: number;
  y: number;
}

export interface Extent {
  xMax: number;
  xMin: number;
  yMax: number;
  yMin: number;
}
