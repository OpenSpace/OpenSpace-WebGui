import {
  GenericMatrixTypesArray,
  GenericNumericTypesArray,
  GenericVectorTypesArray,
  PropertyTypes
} from './propertyTypes';

// Generic types for groups of properties
export type PropertyGroups = {
  GenericMatrixProperty: GenericMatrixTypes;
  GenericVectorProperty: GenericVectorTypes;
  GenericNumericProperty: GenericNumericTypes;
};

// Define a type `GenericVectorTypes` that represents the union of all elements
// in the `GenericVectorTypesArray`.
type GenericVectorTypes = (typeof GenericVectorTypesArray)[number];

// Define a type `GenericMatrixTypes` that represents the union of all elements
// in the `GenericMatrixTypesArray`.
type GenericMatrixTypes = (typeof GenericMatrixTypesArray)[number];

// Define a type `GenericNumericTypes` that represents the union of all elements
// in the `GenericNumericTypesArray`. This is achieved by using the `typeof` operator
// to get the type of the array and indexing it with `[number]` to extract the union
// of its element types.
export type GenericNumericTypes = (typeof GenericNumericTypesArray)[number];

// Define a runtime mapping of property group keys to their corresponding arrays of property types.
// This mapping is used to associate each group in `PropertyGroups` with its respective property types
// defined in `PropertyTypes`. The arrays are immutable and ensure type safety.
export const PropertyGroupsRuntime: Record<
  keyof PropertyGroups,
  readonly (keyof PropertyTypes)[]
> = {
  // Maps the `GenericMatrixProperty` group to the array of matrix property types.
  GenericMatrixProperty: GenericMatrixTypesArray,

  // Maps the `GenericVectorProperty` group to the array of vector property types.
  GenericVectorProperty: GenericVectorTypesArray,

  // Maps the `GenericNumericProperty` group to the array of numeric property types.
  GenericNumericProperty: GenericNumericTypesArray
};

/**
 * A utility type that resolves to a specific group type from `PropertyGroups`
 * if the provided type `T` is a key of `PropertyGroups`. Otherwise, it resolves
 * to the type `T` itself.
 *
 * @template T - The type to be checked against the keys of `PropertyGroups`.
 */
type ExpandGroupAlias<T> = T extends keyof PropertyGroups ? PropertyGroups[T] : T;

/**
 * A utility type that normalizes a given type `T` to its corresponding concrete type
 * based on a predefined mapping. This is achieved by first expanding any group aliases
 * in `T` using `ExpandGroupAlias`, and then checking if the resulting type is a key
 * in the `PropertyTypeMap`. If it is, the type is preserved; otherwise, it resolves to `never`.
 *
 * @template T - The input type to be normalized.
 */
export type NormalizeToConcreteTypes<T> =
  ExpandGroupAlias<T> extends infer U
    ? U extends keyof PropertyTypes
      ? U
      : never
    : never;
