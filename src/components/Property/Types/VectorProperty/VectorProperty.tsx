import { useGetGenericVectorPropertyValue, useGetPropertyDescription } from '@/api/hooks';
import { AdditionalDataVectorMatrix, PropertyProps } from '@/components/Property/types';

import { ColorView } from './ViewOptions/ColorView';
import { DefaultView } from './ViewOptions/DefaultView';
import { MinMaxRangeView } from './ViewOptions/MinMaxRange';

interface Props extends PropertyProps {
  isInt?: boolean;
}

type ViewOptions = {
  Color?: boolean;
  MinMaxRange?: boolean;
};

export function VectorProperty({ uri, isInt = false, readOnly }: Props) {
  const [value, setPropertyValue] = useGetGenericVectorPropertyValue(uri);
  const description = useGetPropertyDescription(uri);

  if (!description || !value) {
    return <></>;
  }

  const viewOptions = description.metaData.ViewOptions as ViewOptions;
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
