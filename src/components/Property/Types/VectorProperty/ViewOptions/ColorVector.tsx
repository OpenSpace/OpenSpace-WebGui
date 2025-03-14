import { Flex, RGBA } from '@mantine/core';

import { ColorPicker } from '@/components/ColorPicker/ColorPicker';
import { VectorPropertyProps } from '@/components/Property/Types/VectorProperty/VectorProperty';

import { ValueList } from './DefaultValueList';

export function ColorVector(props: VectorPropertyProps) {
  const { disabled, setPropertyValue, value, isInt } = props;

  if ((value.length !== 3 && value.length !== 4) || isInt) {
    throw Error('Invalid use of Color view option!');
  }
  const hasAlpha = value.length === 4;

  return (
    <Flex gap={'xs'} align={'center'}>
      <ValueList {...props} />
      <ColorPicker
        disabled={disabled}
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
