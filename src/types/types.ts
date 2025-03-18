import { Property } from '@/components/Property/Property';

import { PropertyVisibilityNumber } from './enums';
import {
  AdditionalDataNumber,
  AdditionalDataVectorMatrix
} from '@/components/Property/types';
import { AdditionalDataOptions } from '@/components/Property/Types/OptionProperty';
import { AdditionalDataSelection } from '@/components/Property/Types/SelectionProperty';

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

export type AdditionalData =
  | AdditionalDataNumber
  | AdditionalDataVectorMatrix
  | AdditionalDataOptions
  | AdditionalDataSelection;

export interface PropertyDetails {
  additionalData: AdditionalData;
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
