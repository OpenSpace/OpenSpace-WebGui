import { AnyProperty } from './Property/property';

export type Uri = string;
export type Identifier = string;

export type LanguageInfo = {
  language: string;
  icon: React.JSX.Element;
};

export interface Action {
  identifier: string;
  guiPath: string;
  name: string;
  isLocal: boolean;
  documentation: string;
  color?: [number, number, number, number]; // rgba color, [0, 1]
}

export type KeybindModifiers = ('super' | 'alt' | 'shift' | 'control')[];

export interface Keybind {
  action: string;
  key: string;
  modifiers: KeybindModifiers;
}

export type ActionOrKeybind = Action | Keybind;

export type KeybindInfoType = Keybind & Action;

export interface SemanticVersion {
  major: number;
  minor: number;
  patch: number;
}

// The property owner data we get from OpenSpace is different from what we want to store
// in the redux state, hence this local owner type to get proper ts highlighting when
// converting the data
export type OpenSpacePropertyOwner = {
  description: string;
  guiName: string;
  identifier: Identifier;
  properties: AnyProperty[];
  subowners: OpenSpacePropertyOwner[];
  tag: string[];
  uri: Uri;
};

export interface PropertyOverviewData {
  name: string;
  visibility: number;
}

export interface PropertyOverview {
  [uri: string]: PropertyOverviewData;
}

export interface Properties {
  [key: Uri]: AnyProperty | undefined;
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

export interface SceneGraphNodeGuiSettings {
  [key: Uri]: {
    path: string;
    isHidden: boolean;
    isFocusable: boolean;
    guiOrderingNumber: number | undefined;
  };
}

export type Group = {
  subgroups: string[]; // group paths
  propertyOwners: Uri[];
};

export type Groups = {
  [key: string]: Group;
};

export type CustomGroupOrdering = {
  // The value is a list of node names in the order they should be displayed
  [key: string]: string[] | undefined;
};

// This type makes it possible to require that at least one (or all) of
// the optional properties in an interface are required.
// Code found here:
// https://stackoverflow.com/questions/40510611/typescript-interface-require-one-of-two-properties-to-exist
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];
