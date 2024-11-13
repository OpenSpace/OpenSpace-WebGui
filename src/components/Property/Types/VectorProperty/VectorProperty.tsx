import { ValueList } from './ViewOptions/DefaultValueList';
import { MinMaxRange } from './ViewOptions/MinMaxRange';

export interface VectorPropertyProps {
  name: string;
  description: string;
  disabled: boolean;
  setPropertyValue: (newValue: number[]) => void;
  value: number[];
  additionalData: {
    Exponent: number; // TODO: handle the exponent
    MaximumValue: number[];
    MinimumValue: number[];
    SteppingValue: number[];
  },
  viewOptions: {
    Color?: boolean;
    MinMaxRange?: boolean;
  }
}

export function VectorProperty(props: VectorPropertyProps) {
  const { value, viewOptions } = props;

  if (value.length === 2 && viewOptions.MinMaxRange) {
    return <MinMaxRange {...props} />
  }

  return <ValueList {...props} />
}
