import {
  useGetGenericVectorPropertyValue,
  useGetPropertyDescription
} from 'src/hooks/properties';

import {
  AdditionalDataVectorMatrix,
  PropertyProps,
  ViewOptionsVector
} from '@/components/Property/types';

import { ColorView } from './ViewOptions/ColorView';
import { DefaultView } from './ViewOptions/DefaultView';
import { MinMaxRangeView } from './ViewOptions/MinMaxRange';

interface Props extends PropertyProps {
  isInt?: boolean;
}

export function VectorProperty({ uri, isInt = false, readOnly }: Props) {
  const [value, setPropertyValue] = useGetGenericVectorPropertyValue(uri);
  const description = useGetPropertyDescription(uri);

  if (!description || !value) {
    return <></>;
  }

  const viewOptions = description.metaData.ViewOptions as ViewOptionsVector;
  const additionalData = description.additionalData as AdditionalDataVectorMatrix;

  if (viewOptions.Color) {
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

  if (viewOptions.MinMaxRange) {
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
    <DefaultView
      disabled={readOnly}
      setPropertyValue={setPropertyValue}
      value={value}
      additionalData={additionalData}
      isInt={isInt}
    />
  );
}
