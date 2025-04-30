// Define an immutable array of generic numeric property types using `Object.freeze` and `as const`.
// This ensures that the array is read-only and its elements are treated as literal types.
export const GenericNumericTypesArray = Object.freeze([
  'FloatProperty',
  'DoubleProperty',
  'ShortProperty',
  'UShortProperty',
  'LongProperty',
  'ULongProperty',
  'IntProperty',
  'UIntProperty'
] as const);

// Define an immutable array of generic vector property types using `Object.freeze` and `as const`.
export const GenericVectorTypesArray = Object.freeze([
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

// Define an immutable array of generic matrix property types using `Object.freeze` and `as const`.
export const GenericMatrixTypesArray = Object.freeze([
  'Mat2Property',
  'Mat3Property',
  'Mat4Property',
  'DMat2Property',
  'DMat3Property',
  'DMat4Property'
] as const);

export type ViewOptionsVector =
  | {
      Color?: boolean;
      MinMaxRange?: boolean;
    }
  | undefined;

// In OpenSpace the options are represented like so:
// { 1: "Option 1", 2: "Option 2", ...}
// The key is an integer but in a string format.
export interface AdditionalDataOptions {
  options: Record<string, string>;
}

export interface AdditionalDataSelection {
  options: string[];
}

export interface AdditionalDataVectorMatrix {
  exponent: number; // TODO: handle the exponent
  max: number[];
  min: number[];
  step: number[];
}

export interface AdditionalDataNumber {
  exponent: number;
  max: number;
  min: number;
  step: number;
}

interface NumberProperty {
  value: number;
  additionalData: AdditionalDataNumber;
}
interface VectorProperty {
  value: number[];
  additionalData: AdditionalDataVectorMatrix;
  viewOptions: ViewOptionsVector;
}
interface MatrixProperty {
  value: number[];
  additionalData: AdditionalDataVectorMatrix;
}

export type PropertyTypes = {
  TriggerProperty: {
    value: null;
  };
  BoolProperty: {
    value: boolean;
  };
  StringProperty: {
    value: string;
  };
  SelectionProperty: {
    value: string[];
    additionalData: AdditionalDataSelection;
  };
  OptionProperty: {
    value: number;
    additionalData: AdditionalDataOptions;
  };
  DoubleListProperty: {
    value: number[];
  };
  IntListProperty: {
    value: number[];
  };
  StringListProperty: {
    value: string[];
  };
  // Number properties
  DoubleProperty: NumberProperty;
  FloatProperty: NumberProperty;
  IntProperty: NumberProperty;
  LongProperty: NumberProperty;
  ShortProperty: NumberProperty;
  UIntProperty: NumberProperty;
  ULongProperty: NumberProperty;
  UShortProperty: NumberProperty;
  // Vector properties
  Vec2Property: VectorProperty;
  Vec3Property: VectorProperty;
  Vec4Property: VectorProperty;
  DVec2Property: VectorProperty;
  DVec3Property: VectorProperty;
  DVec4Property: VectorProperty;
  IVec2Property: VectorProperty;
  IVec3Property: VectorProperty;
  IVec4Property: VectorProperty;
  UVec2Property: VectorProperty;
  UVec3Property: VectorProperty;
  UVec4Property: VectorProperty;
  // Matrix properties
  Mat2Property: MatrixProperty;
  Mat3Property: MatrixProperty;
  Mat4Property: MatrixProperty;
  DMat2Property: MatrixProperty;
  DMat3Property: MatrixProperty;
  DMat4Property: MatrixProperty;
};
