import { PropertyVisibilityNumber } from '../enums';
import { NormalizeToConcreteTypes, PropertyGroups } from './propertyGroups';
import { PropertyTypes } from './propertyTypes';

export type ViewOptionsVector =
  | {
      Color?: boolean;
      MinMaxRange?: boolean;
    }
  | undefined;

export type PropertyVisibility = keyof typeof PropertyVisibilityNumber;

/**
 * Extracts the `additionalData` property from a specific property type in `PropertyTypes`.
 *
 * This utility type checks if the specified property type in `PropertyTypes` contains
 * an `additionalData` field. If it does, it creates a new type with the `additionalData`
 * field. Otherwise, it defaults to an empty object type.
 */
type AdditionalData<T extends keyof PropertyTypes> = PropertyTypes[T] extends {
  additionalData: infer A;
}
  ? { additionalData: A }
  : {};

// Generic Property<T> type
type Property<T extends keyof PropertyTypes> = {
  metaData: {
    type: T;
    description: string;
    isReadOnly: boolean;
    guiName: string;
    group: string;
    needsConfirmation: boolean;
    visibility: PropertyVisibility;
    viewOptions?: Record<string, boolean>;
  } & AdditionalData<T>;
  value: PropertyTypes[T]['value'];
  uri: string;
};

/**
 * Represents a union type of all possible `Property<K>` types, where `K` is a key
 * from the `PropertyTypes` interface. This type dynamically maps each key in
 * `PropertyTypes` to its corresponding `Property<K>` type and then combines them
 * into a single type using a mapped type and indexed access.
 */
export type AnyProperty = {
  [K in keyof PropertyTypes]: Property<K>;
}[keyof PropertyTypes];

// A utility type that creates a union of `Property<T>` types for all keys `T` in `PropertyTypeMap`.
// This is achieved by iterating over each key `T` in `PropertyTypeMap` and resolving it to `Property<T>`.
// The `T extends any` construct ensures that the union is properly distributed over all keys.
type PropertyUnion<T extends keyof PropertyTypes> = T extends any ? Property<T> : never;

// Export a nicer name for the union type
export type PropertyOrPropertyGroup<T> = PropertyUnion<NormalizeToConcreteTypes<T>>;

// All allowed keys for property types - groups and specific property types
export type PropertyTypeKey = keyof PropertyTypes | keyof PropertyGroups;
