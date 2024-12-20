export type Uri = string;
export type Identifier = string;

export interface Action {
  identifier: string;
  guiPath: string;
  name: string;
  synchronization: boolean;
  documentation: string;
}

export interface Keybind {
  action: string;
  key: string;
  modifiers: {
    alt: boolean;
    control: boolean;
    shift: boolean;
    super: boolean;
  };
}

export type ActionOrKeybind = Action | Keybind;

export interface SemanticVersion {
  major: number;
  minor: number;
  patch: number;
}

// Incomplete type objects for the ArcGIS object we request for GeoLocationPanel
// This was to avoid having to import the entire ArcGIS core since the @types file is
// deprecated on npm.
export type ArcGISJSON = {
  candidates: Candidate[];
  spatialReference: object;
};

export type Candidate = {
  address: string;
  attributes: {
    LongLabel: string;
  };
  extent: Extent;
  location: Location;
};

export type Location = {
  x: number;
  y: number;
};

export type Extent = {
  xmax: number;
  xmin: number;
  ymax: number;
  ymin: number;
};

export interface ExoplanetData {
  name: string;
  identifier: Identifier;
}

export interface PropertyMetaData {
  Group: string;
  ViewOptions: {
    [key: string]: boolean;
  };
  Visibility: string; // TODO specify this as developer  | user | noviceUser etc
  isReadOnly: boolean;
  needsConfirmation: boolean;
}

export type PropertyValue = string | number | number[] | boolean | null;
export interface Property {
  description: {
    additionalData: any;
    identifier: Identifier;
    metaData: PropertyMetaData;
    name: string;
    type: string; // TODO: define these as property types i.e., boolproperty, stringproperty etc
    description: string;
  };
  value: PropertyValue; // TODO: investigate if these are all the values we can have
  uri: Uri;
}

export interface Properties {
  [key: Uri]: Property | undefined;
}

export interface PropertyOwner {
  description: string;
  name: string;
  identifier: Identifier;
  properties: Uri[];
  subowners: Uri[];
  tags: string[];
  uri: Uri;
}

export interface PropertyOwners {
  [key: Uri]: PropertyOwner | undefined;
}

export type Group = {
  subgroups: string[]; // group paths
  propertyOwners: Uri[];
};

export type Groups = {
  [key: string]: Group;
};

export type OpenSpaceTimeState = {
  time?: string;
  timeCapped?: string;
  targetDeltaTime?: number;
  deltaTime?: number;
  isPaused?: boolean;
  hasNextStep?: boolean;
  hasPrevStep?: boolean;
  nextStep?: number;
  prevStep?: number;
  deltaTimeSteps?: number[];
};
