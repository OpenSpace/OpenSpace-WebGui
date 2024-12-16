import { PropertyLabel } from '../../PropertyLabel';

import { ColorVector } from './ViewOptions/ColorVector';
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
  };
  viewOptions: {
    Color?: boolean;
    MinMaxRange?: boolean;
  };
}

export function VectorProperty(props: VectorPropertyProps) {
  const { value, viewOptions, name, description } = props;

  const isColor = value.length === 3 || (value.length === 4 && viewOptions.Color);
  const isMinMaxRange = value.length === 2 && viewOptions.MinMaxRange;

  let view;
  if (isColor) {
    view = <ColorVector {...props} />;
  } else if (isMinMaxRange) {
    view = <MinMaxRange {...props} />;
  } else {
    view = <ValueList {...props} />;
  }

  return (
    <>
      <PropertyLabel label={name} tip={description} />
      {view}
    </>
  );
}
