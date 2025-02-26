import { MantineStyleProps } from '@mantine/core';

import { NumericInput } from '@/components/Input/NumericInput/NumericInput';

import { StackedStepControls } from './StackedStepControls';

interface Props extends MantineStyleProps {
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
  ...styleProps
}: Props) {
  return (
    <StackedStepControls onChange={onInputChangeStep} step={step}>
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
        {...styleProps}
      />
    </StackedStepControls>
  );
}
