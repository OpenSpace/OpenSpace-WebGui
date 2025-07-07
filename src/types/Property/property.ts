import { PropertyVisibilityNumber } from '../enums';
import { Identifier } from '../types';

import { NormalizeToConcreteTypes, PropertyGroups } from './propertyGroups';
import { PropertyTypes } from './propertyTypes';

export type PropertyVisibility = keyof typeof PropertyVisibilityNumber;

// Define an empty object type to use as a default value for optional types
type EmptyObject = { [K in never]: never };

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
  : EmptyObject;

/**
 * Extracts the `viewOptions` property from a specific property type in `PropertyTypes`.
 *
 * This utility type checks if the specified property type in `PropertyTypes` contains
 * an `viewOptions` field. If it does, it creates a new type with the `viewOptions`
 * field. Otherwise, it defaults to an empty object type.
 */
type ViewOptions<T extends keyof PropertyTypes> = PropertyTypes[T] extends {
  viewOptions: infer A;
}
  ? { viewOptions: A }
  : EmptyObject;

// Generic Property<T> type
type Property<T extends keyof PropertyTypes> = {
  metaData: {
    type: T;
    identifier: Identifier;
    description: string;
    isReadOnly: boolean;
    guiName: string;
    group: string;
    needsConfirmation: boolean;
    visibility: PropertyVisibility;
  } & AdditionalData<T> &
    ViewOptions<T>;
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

/**
 * A utility type that creates a union of `Property<T>` types for all keys `T` in `PropertyTypes`.
 * This is achieved by iterating over each key `T` in `PropertyTypes` and resolving it to `Property<T>`.
 * The `T extends any` construct ensures that the union is properly distributed over all keys.
 * The "extends any" syntax seems to be accepted typescript syntax - see
 * https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#conditional-type-constraints */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PropertyUnion<T extends keyof PropertyTypes> = T extends any ? Property<T> : never;

// Export a nicer name for the union type
export type PropertyOrPropertyGroup<T> = PropertyUnion<NormalizeToConcreteTypes<T>>;

// All allowed keys for property types - groups and specific property types
export type PropertyTypeKey = keyof PropertyTypes | keyof PropertyGroups;
