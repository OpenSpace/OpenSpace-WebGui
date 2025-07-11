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

// These min/max names have to be all lowercase in order to match the ArcGIS object we recieve
export interface Extent {
  xmax: number;
  xmin: number;
  ymax: number;
  ymin: number;
}

export interface MatchedLocation {
  name: string;
  centerLatitude: number;
  centerLongitude: number;
  diameter?: number; // For extra-terrestrial locations, this is used to calculate altitude
  extent?: Extent; // For Earth locations, this is used to calculate altitude
  origin: string;
}
