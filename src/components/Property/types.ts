import { Uri } from '@/types/types';

// These props are the same for all property types
export interface PropertyProps {
  uri: Uri;
  readOnly: boolean;
}

export interface AdditionalDataVectorMatrix {
  Exponent: number; // TODO: handle the exponent
  MaximumValue: number[];
  MinimumValue: number[];
  SteppingValue: number[];
}
