import { useState } from 'react';
import { NumberInput } from '@mantine/core';


interface Props {
  label?: React.ReactNode | string;
  disabled?: boolean;
  onEnter?: (newValue: number) => void;
  defaultValue: number;
  min?: number,
  max?: number,
  step?: number
}

/**
 * This is a version of the number input that sets the value only on ENTER, and re-sets
 * the value on ESCAPE.
 */
export function NumericInput({
  label = "",
  disabled = false,
  onEnter = () => { },
  defaultValue,
  min,
  max,
  step
}: Props) {
  const [currentValue, setCurrentValue] = useState<number>(defaultValue);
  let valueWasSet = false;

  function onKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      onEnter(currentValue);
      valueWasSet = true;
      event.currentTarget.blur();
    } else if (event.key === 'Escape') {
      setCurrentValue(defaultValue);
      event.currentTarget.blur();
    }
  }

  function onBlur() {
    if (!valueWasSet) {
      setCurrentValue(defaultValue)
    }
  }

  function onValueChange(newValue: number | undefined) {
    if (newValue !== undefined) {
      setCurrentValue(newValue);
    }
  }

  return (
    <NumberInput
      value={currentValue}
      onKeyUp={(event) => onKeyUp(event)}
      onValueChange={(newValue) => onValueChange(newValue.floatValue)}
      onBlur={onBlur}
      disabled={disabled}
      label={label}
      min={min}
      max={max}
      step={step}
      stepHoldDelay={500}
      stepHoldInterval={100}
    // TODO: Provide error on invalid input
    />
  );
}
