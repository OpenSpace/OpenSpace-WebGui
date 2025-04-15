// In OpenSpace the options are represented like so:
// { 1: "Option 1", 2: "Option 2", ...}
// The key is an integer but in a string format.
interface Options {
  [key: string]: string;
}

export interface AdditionalDataOptions {
  Options: Options;
}

export interface AdditionalDataSelection {
  Options: string[];
}

export interface AdditionalDataVectorMatrix {
  Exponent: number; // TODO: handle the exponent
  MaximumValue: number[];
  MinimumValue: number[];
  SteppingValue: number[];
}

export interface AdditionalDataNumber {
  Exponent: number;
  MaximumValue: number;
  MinimumValue: number;
  SteppingValue: number;
}

export type PropertyTypes = {
  TriggerProperty: {
    value: void;
  };
  BoolProperty: {
    value: boolean;
  };
  StringProperty: {
    value: string;
  };
  MatrixProperty: {
    value: number[];
    additionalData: AdditionalDataVectorMatrix;
  };
  SelectionProperty: {
    value: string[];
    additionalData: AdditionalDataSelection;
  };
  OptionProperty: {
    value: number;
    additionalData: AdditionalDataOptions;
  };
  Vec2Property: {
    value: number[];
    additionalData: AdditionalDataVectorMatrix;
  };
  Vec3Property: {
    value: number[];
    additionalData: AdditionalDataVectorMatrix;
  };
  Vec4Property: {
    value: number[];
    additionalData: AdditionalDataVectorMatrix;
  };
  DVec2Property: {
    value: number[];
    additionalData: AdditionalDataVectorMatrix;
  };
  DVec3Property: {
    value: number[];
    additionalData: AdditionalDataVectorMatrix;
  };
  DVec4Property: {
    value: number[];
    additionalData: AdditionalDataVectorMatrix;
  };
  IVec2Property: {
    value: number[];
    additionalData: AdditionalDataVectorMatrix;
  };
  IVec3Property: {
    value: number[];
    additionalData: AdditionalDataVectorMatrix;
  };
  IVec4Property: {
    value: number[];
    additionalData: AdditionalDataVectorMatrix;
  };
  UVec2Property: {
    value: number[];
    additionalData: AdditionalDataVectorMatrix;
  };
  UVec3Property: {
    value: number[];
    additionalData: AdditionalDataVectorMatrix;
  };
  UVec4Property: {
    value: number[];
    additionalData: AdditionalDataVectorMatrix;
  };
  DoubleProperty: {
    value: number;
    additionalData: AdditionalDataNumber;
  };
  FloatProperty: {
    value: number;
    additionalData: AdditionalDataNumber;
  };
  IntProperty: {
    value: number;
    additionalData: AdditionalDataNumber;
  };
  LongProperty: {
    value: number;
    additionalData: AdditionalDataNumber;
  };
  ShortProperty: {
    value: number;
    additionalData: AdditionalDataNumber;
  };
  UIntProperty: {
    value: number;
    additionalData: AdditionalDataNumber;
  };
  ULongProperty: {
    value: number;
    additionalData: AdditionalDataNumber;
  };
  UShortProperty: {
    value: number;
    additionalData: AdditionalDataNumber;
  };
  Mat2Property: {
    value: number[];
    additionalData: AdditionalDataVectorMatrix;
  };
  Mat3Property: {
    value: number[];
    additionalData: AdditionalDataVectorMatrix;
  };
  Mat4Property: {
    value: number[];
    additionalData: AdditionalDataVectorMatrix;
  };
  DMat2Property: {
    value: number[];
    additionalData: AdditionalDataVectorMatrix;
  };
  DMat3Property: {
    value: number[];
    additionalData: AdditionalDataVectorMatrix;
  };
  DMat4Property: {
    value: number[];
    additionalData: AdditionalDataVectorMatrix;
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
};
