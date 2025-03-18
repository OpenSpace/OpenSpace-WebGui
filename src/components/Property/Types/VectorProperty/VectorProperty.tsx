import { useGetPropertyDescription, useProperty } from '@/api/hooks';
import { AdditionalDataVectorMatrix, PropertyProps } from '@/components/Property/types';

import { DefaultView } from './ViewOptions/DefaultView';
import { MinMaxRangeView } from './ViewOptions/MinMaxRange';
import { ColorView } from './ViewOptions/ColorView';

const vectorPropertyTypes = [
  'Vec2Property',
  'Vec3Property',
  'Vec4Property',
  'DVec2Property',
  'DVec3Property',
  'DVec4Property',
  'IVec2Property',
  'IVec3Property',
  'IVec4Property',
  'UVec2Property',
  'UVec3Property',
  'UVec4Property'
];

interface Props extends PropertyProps {
  isInt?: boolean;
}

type ViewOptions = {
  Color?: boolean;
  MinMaxRange?: boolean;
};

export function VectorProperty({ uri, isInt = false, readOnly }: Props) {
  const [value, setPropertyValue] = useProperty<number[]>(uri, vectorPropertyTypes);
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
