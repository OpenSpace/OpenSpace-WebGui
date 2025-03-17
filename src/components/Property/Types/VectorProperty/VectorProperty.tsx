import { Flex, RGBA } from '@mantine/core';

import { useGetPropertyDescription, useProperty } from '@/api/hooks';
import { ColorPicker } from '@/components/ColorPicker/ColorPicker';

import { AdditionalDataVectorMatrix, PropertyProps } from '@/components/Property/types';

import { DefaultView } from './ViewOptions/DefaultView';
import { MinMaxRange } from './ViewOptions/MinMaxRange';

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

export function VectorProperty({ uri, isInt }: Props) {
  const [value, setPropertyValue] = useProperty<number[]>(uri, vectorPropertyTypes);
  const description = useGetPropertyDescription(uri);

  if (!description || !value) {
    return <></>;
  }

  const viewOptions = description.metaData.ViewOptions;
  const additionalData = description.additionalData as AdditionalDataVectorMatrix;
  const { isReadOnly } = description.metaData;

  if (viewOptions.Color) {
    if ((value.length !== 3 && value.length !== 4) || isInt) {
      throw Error('Invalid use of Color view option!');
    }
    const hasAlpha = value.length === 4;

    return (
      <Flex gap={'xs'} align={'center'}>
        <DefaultView
          disabled={isReadOnly}
          setPropertyValue={setPropertyValue}
          value={value}
          additionalData={additionalData}
        />
        <ColorPicker
          disabled={isReadOnly}
          withAlpha={hasAlpha}
          color={{
            r: Math.round(255 * value[0]),
            g: Math.round(255 * value[1]),
            b: Math.round(255 * value[2]),
            a: hasAlpha ? value[3] : 1.0
          }}
          onChange={(rgbaColor: RGBA) => {
            const newValue = [rgbaColor.r / 255, rgbaColor.g / 255, rgbaColor.b / 255];
            if (hasAlpha) {
              newValue.push(rgbaColor.a);
            }
            // @TODO (emmbr26, 2025-03-14) Check for min max values. color values should be
            // between 0 and 1.
            setPropertyValue(newValue);
          }}
        />
      </Flex>
    );
  }

  if (viewOptions.MinMaxRange) {
    if (value.length !== 2) {
      throw Error('Invalid use of MinMaxRange view option!');
    }
    return (
      <MinMaxRange
        value={value}
        setPropertyValue={setPropertyValue}
        additionalData={additionalData}
        disabled={isReadOnly}
      />
    );
  }

  return (
    <DefaultView
      disabled={isReadOnly}
      setPropertyValue={setPropertyValue}
      value={value}
      additionalData={additionalData}
      isInt={isInt}
    />
  );
}
