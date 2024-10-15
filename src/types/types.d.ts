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

type ActionOrKeybind = Action | Keybind;

export interface ExoplanetData {
  name: string;
  identifier: string;
}

export interface Property {
  description: {
    AdditionalData: any;
    Identifier: string;
    MetaData: any;
    Name: string;
    Type: string;
    description: string;
  };
  value: string | number | number[] | boolean;
  uri: string;
}

export interface Properties {
  [key: string]: Property;
}

export interface PropertyOwner {
  identifier: string;
  name: string;
  properties: string[];
  subowners: string[];
  tags: string[];
  uri: string;
}

export interface PropertyOwners {
  [key: string]: PropertyOwner;
}
