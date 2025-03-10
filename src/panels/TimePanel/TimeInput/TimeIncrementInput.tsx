import { MantineStyleProps, NumberInputProps } from '@mantine/core';

import { NumericInput } from '@/components/Input/NumericInput/NumericInput';

import { StackedStepControls } from './StackedStepControls';

interface Props extends MantineStyleProps, NumberInputProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onInputEnter: (value: number) => void;
  onInputChangeStep: (change: number) => void;
  onInputChange?: (value: number | string) => void;
  onInputBlur?: (event: React.FocusEvent<HTMLInputElement, Element>) => void;
}

export function TimeIncrementInput({
  value,
  onInputEnter,
  onInputChangeStep,
  onInputChange,
  onInputBlur,
  min,
  max,
  step,
  style,
  ...props
}: Props) {
  return (
    <StackedStepControls onChange={onInputChangeStep} step={step} {...style}>
      <NumericInput
        value={value}
        onEnter={onInputEnter}
        onChange={onInputChange}
        onBlur={onInputBlur}
        clampBehavior={'strict'}
        hideControls
        min={min}
        max={max}
        step={step}
        {...props}
      />
    </StackedStepControls>
  );
}
