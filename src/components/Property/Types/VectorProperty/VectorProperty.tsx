import {
  AdditionalDataVectorMatrix,
  PropertyProps,
  ViewOptionsVector
} from '@/components/Property/types';
import { useGenericVectorProperty, usePropertyDescription } from '@/hooks/properties';

import { ColorView } from './ViewOptions/ColorView';
import { MinMaxRangeView } from './ViewOptions/MinMaxRange';
import { VectorDefaultView } from './ViewOptions/VectorDefaultView';

interface Props extends PropertyProps {
  isInt?: boolean;
}

export function VectorProperty({ uri, isInt = false, readOnly }: Props) {
  const [value, setPropertyValue] = useGenericVectorProperty(uri);
  const description = usePropertyDescription(uri);

  if (!description || !value) {
    return <></>;
  }

  const viewOptions = description.viewOptions as ViewOptionsVector;
  const additionalData = description.additionalData as AdditionalDataVectorMatrix;

  if (viewOptions?.Color) {
    return (
      <ColorView
        value={value}
        setPropertyValue={setPropertyValue}
        additionalData={additionalData}
        readOnly={readOnly}
        isInt={isInt}
      />
    );
  }

  if (viewOptions?.MinMaxRange) {
    return (
      <MinMaxRangeView
        value={value}
        setPropertyValue={setPropertyValue}
        additionalData={additionalData}
        disabled={readOnly}
      />
    );
  }

  return (
    <VectorDefaultView
      disabled={readOnly}
      setPropertyValue={setPropertyValue}
      value={value}
      additionalData={additionalData}
      isInt={isInt}
    />
  );
}
