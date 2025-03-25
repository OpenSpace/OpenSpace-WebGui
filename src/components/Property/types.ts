import { Uri } from '@/types/types';

// These props are the same for all property types
export interface PropertyProps {
  uri: Uri;
  readOnly: boolean;
}

// In OpenSpace the options are represented like so:
// { 0: "Option 1"}, { 1: "Option 2"}
// The key is a number but in a string format.
interface Option {
  [key: string]: string;
}

export interface AdditionalDataOptions {
  Options: Option[];
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

export type AdditionalData =
  | AdditionalDataNumber
  | AdditionalDataVectorMatrix
  | AdditionalDataOptions
  | AdditionalDataSelection;

export type ViewOptionsVector = {
  Color?: boolean;
  MinMaxRange?: boolean;
};
