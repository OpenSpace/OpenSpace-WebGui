import { Flex, RGBA } from '@mantine/core';

import { ColorPicker } from '@/components/ColorPicker/ColorPicker';
import { AdditionalDataVectorMatrix } from '@/components/Property/types';

import { VectorDefaultView } from './VectorDefaultView';

interface Props {
  setPropertyValue: (value: number[]) => void;
  value: number[];
  additionalData: AdditionalDataVectorMatrix;
  readOnly: boolean;
  isInt: boolean;
}

export function ColorView({
  readOnly,
  setPropertyValue,
  value,
  additionalData,
  isInt
}: Props) {
  if ((value.length !== 3 && value.length !== 4) || isInt) {
    throw Error('Invalid use of Color view option!');
  }
  const hasAlpha = value.length === 4;

  return (
    <Flex gap={'xs'} align={'center'}>
      <VectorDefaultView
        disabled={readOnly}
        setPropertyValue={setPropertyValue}
        value={value}
        additionalData={additionalData}
      />
      <ColorPicker
        disabled={readOnly}
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
