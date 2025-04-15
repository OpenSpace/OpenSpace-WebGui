import { PropertyTypes } from './propertyTypes';

// Generic types for groups of properties
export type PropertyGroups = {
  GenericMatrixProperty: GenericMatrixTypes;
  GenericVectorProperty: GenericVectorTypes;
  GenericNumericProperty: GenericNumericTypes;
};

// Define an immutable array of generic vector property types using `Object.freeze` and `as const`.
const GenericVectorTypesArray = Object.freeze([
  'Vec2Property',
  'Vec3Property',
  'Vec4Property',
  'DVec2Property',
  'DVec3Property',
  'DVec4Property',
  'IVec2Property',
  'IVec3Property',
  'IVec4Property',
  'UVec2Property',
  'UVec3Property',
  'UVec4Property'
] as const);

// Define a type `GenericVectorTypes` that represents the union of all elements
// in the `GenericVectorTypesArray`.
type GenericVectorTypes = (typeof GenericVectorTypesArray)[number];

// Define an immutable array of generic matrix property types using `Object.freeze` and `as const`.
const GenericMatrixTypesArray = Object.freeze([
  'Mat2Property',
  'Mat3Property',
  'Mat4Property',
  'DMat2Property',
  'DMat3Property',
  'DMat4Property'
] as const);

// Define a type `GenericMatrixTypes` that represents the union of all elements
// in the `GenericMatrixTypesArray`.
type GenericMatrixTypes = (typeof GenericMatrixTypesArray)[number];

// Define an immutable array of generic numeric property types using `Object.freeze` and `as const`.
// This ensures that the array is read-only and its elements are treated as literal types.
const GenericNumericTypesArray = Object.freeze([
  'FloatProperty',
  'DoubleProperty',
  'ShortProperty',
  'UShortProperty',
  'LongProperty',
  'ULongProperty',
  'IntProperty',
  'UIntProperty'
] as const);

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
 * A utility type that resolves to a specific group type from `VirtualPropertyGroups`
 * if the provided type `T` is a key of `VirtualPropertyGroups`. Otherwise, it resolves
 * to the type `T` itself.
 *
 * @template T - The type to be checked against the keys of `VirtualPropertyGroups`.
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
