import { MantineStyleProps } from '@mantine/core';

import { NumericInput } from '@/components/Input/NumericInput/NumericInput';

import { StackedStepControls } from './StackedStepControls';

interface Props extends MantineStyleProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onInputChange: (value: number) => void;
  onInputChangeStep: (change: number) => void;
}

export function TimeIncrementInput({
  value,
  onInputChange,
  onInputChangeStep,
  min,
  max,
  step,
  ...styleProps
}: Props) {
  return (
    <StackedStepControls
      onChange={(value) => onInputChangeStep(value)}
      step={step}
      {...styleProps}
    >
      <NumericInput
        value={value}
        onEnter={(newValue) => onInputChange(newValue)}
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
