import { MantineStyleProps } from '@mantine/core';

import { NumericInput } from '@/components/Input/NumericInput/NumericInput';

import { StackedStepControls } from './StackedStepControls';

interface Props extends MantineStyleProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onInputChange: (value: number, relative: boolean, interpolate: boolean) => void;
}

export function TimeIncrementInput({
  value,
  onInputChange,
  min,
  max,
  step,
  ...styleProps
}: Props) {
  return (
    <StackedStepControls
      onChange={(value, shiftKey) => onInputChange(value, true, !shiftKey)}
      step={step}
    >
      <NumericInput
        value={value}
        onEnter={(newValue) => onInputChange(newValue, false, false)}
        clampBehavior={'strict'}
        hideControls
        min={min}
        max={max}
        step={step}
        {...styleProps}
      />
    </StackedStepControls>
  );
}
