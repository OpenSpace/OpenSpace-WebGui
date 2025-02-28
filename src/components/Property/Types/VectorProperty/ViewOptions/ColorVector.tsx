import { Flex, RGBA } from '@mantine/core';

import { ColorPicker } from '@/components/ColorPicker/ColorPicker';
import { VectorPropertyProps } from '@/components/Property/Types/VectorProperty/VectorProperty';

import { ValueList } from './DefaultValueList';

export function ColorVector(props: VectorPropertyProps) {
  const { disabled, setPropertyValue, value } = props;
  const hasAlpha = value.length === 4;

  function setValue(newValue: number[]) {
    setPropertyValue(newValue);
  }

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
          setValue(newValue);
        }}
      />
    </Flex>
  );
}
