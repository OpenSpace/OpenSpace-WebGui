// These props are the same for all property types
export interface PropertyProps {
  uri: string;
}

export interface AdditionalDataNumber {
  Exponent: number;
  MaximumValue: number;
  MinimumValue: number;
  SteppingValue: number;
}

export interface AdditionalDataVectorMatrix {
  Exponent: number; // TODO: handle the exponent
  MaximumValue: number[];
  MinimumValue: number[];
  SteppingValue: number[];
}
