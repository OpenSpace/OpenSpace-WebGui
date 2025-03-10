import { ConcretePropertyBaseProps } from '../../types';

import { ColorVector } from './ViewOptions/ColorVector';
import { ValueList } from './ViewOptions/DefaultValueList';
import { MinMaxRange } from './ViewOptions/MinMaxRange';

export interface VectorPropertyProps extends ConcretePropertyBaseProps {
  setPropertyValue: (newValue: number[]) => void;
  value: number[];
  additionalData: {
    Exponent: number; // TODO: handle the exponent
    MaximumValue: number[];
    MinimumValue: number[];
    SteppingValue: number[];
  };
  viewOptions: {
    Color?: boolean;
    MinMaxRange?: boolean;
  };
  // Not part of the data from OpenSpace
  isInt?: boolean;
}

export function VectorProperty(props: VectorPropertyProps) {
  const { viewOptions } = props;

  if (viewOptions.Color) {
    return <ColorVector {...props} />;
  }

  if (viewOptions.MinMaxRange) {
    return <MinMaxRange {...props} />;
  }

  return <ValueList {...props} />;
}
