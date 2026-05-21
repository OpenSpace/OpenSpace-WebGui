import { Action, AnyProperty, Keybind } from 'openspace-api-js/types';

export type Visibility = 'Visible' | 'Hidden' | 'Fading';

export type Uri = string;
export type Identifier = string;

// The order of these groups determine the order in which they are shown in the `Windows` menu
export const menuItemGroups = ['Ungrouped', 'Content', 'Other', 'Help'] as const;
export type MenuItemGroup = (typeof menuItemGroups)[number];

export type LanguageInfo = {
  language: string;
  icon: React.JSX.Element;
};

export type KeybindModifiers = (keyof Keybind['modifiers'])[];

// The `Keybind` interface coming from the OpenSpace API has slightly differnet data
// structure than what we want to use. @TODO (anden88 2026-05-20): We should either change
// how the data is sent from OpenSpace or make changs in how we use the data in the
// frontend to avoid this type of "copying"
export type KeybindRedux = Pick<Keybind, 'action' | 'key'> & {
  modifiers: KeybindModifiers;
};
// @TODO (anden88 2026-04-07): This is currently not being used in favour of
// `KeybindInfoType` does this concatenation of the Keybind and Action make sense?
export type ActionOrKeybind = Action | KeybindRedux;

export type KeybindInfoType = KeybindRedux & Action;

export interface Properties {
  [key: Uri]: AnyProperty | undefined;
}

export interface PropertyOwners {
  [key: Uri]: PropertyOwnerRedux | undefined;
}

// This interface was previously `PropertyOwner` but was renamed since the TypeScript API
// exports an interface with te same name. @TODO (anden88 2026-05-20): We should either
// change how the data is sent from OpenSpace or rename this interface to something else
// to avoid using "Redux in the name. Currently we store only the URI of the properties
// and subowners, while OpenSpace send a full recursive tree
export interface PropertyOwnerRedux {
  description: string;
  name: string;
  identifier: Identifier;
  properties: Uri[];
  subowners: Uri[];
  tags: string[];
  uri: Uri;
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
