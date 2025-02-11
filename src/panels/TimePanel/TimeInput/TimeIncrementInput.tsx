import { NumberInputProps } from '@mantine/core';

import { NumericInput } from '@/components/Input/NumericInput/NumericInput';

import { StackedStepControls } from './StackedStepControls';

interface Props extends NumberInputProps {
  value: number;
  onInputChange: (value: number, relative: boolean, interpolate: boolean) => void;
}

export function TimeIncrementInput({ value, onInputChange, step, ...props }: Props) {
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
        {...props}
      />
    </StackedStepControls>
  );
}
