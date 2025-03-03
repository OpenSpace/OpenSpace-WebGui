import { Property } from '@/components/Property/Property';

import { PropertyVisibilityNumber } from './enums';

export type Uri = string;
export type Identifier = string;

export interface Action {
  identifier: string;
  guiPath: string;
  name: string;
  synchronization: boolean;
  documentation: string;
}

export type KeybindModifiers = ('super' | 'alt' | 'shift' | 'control')[];

export interface Keybind {
  action: string;
  key: string;
  modifiers: KeybindModifiers;
}

export type ActionOrKeybind = Action | Keybind;

export interface SemanticVersion {
  major: number;
  minor: number;
  patch: number;
}

export type PropertyVisibility = keyof typeof PropertyVisibilityNumber;

export interface PropertyMetaData {
  Group: string;
  ViewOptions: {
    [key: string]: boolean;
  };
  Visibility: PropertyVisibility;
  isReadOnly: boolean;
  needsConfirmation: boolean;
}

export interface PropertyDetails {
  // TODO: ylvse (2025-02-17): create the type for additionalData
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  additionalData: any;
  identifier: Identifier;
  metaData: PropertyMetaData;
  name: string;
  type: string; // TODO: define these as property types i.e., boolproperty, stringproperty etc
  description: string;
}

export type PropertyValue = string | string[] | number | number[] | boolean | null;

export interface Property {
  description: PropertyDetails;
  value: PropertyValue;
  uri: Uri;
}

export interface PropertyOverview {
  [uri: string]: { name: string; visibility: number };
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

export type CustomGroupOrdering = {
  // The value is a list of node names in the order they should be displayed
  [key: string]: string[] | undefined;
};
