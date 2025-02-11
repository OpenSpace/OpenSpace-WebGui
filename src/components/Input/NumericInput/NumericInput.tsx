import { useEffect, useState } from 'react';
import { NumberInput, NumberInputProps } from '@mantine/core';

import { NumberStepControls } from './NumberStepControls';

interface Props extends NumberInputProps {
  // The function to call when the user hits the ENTER key or presses the UP/DOWN buttons
  onEnter?: (newValue: number) => void;
  // The value of the input - here we only allow numbers, not strings
  value: number;
}

/**
 * This is a version of the NumberInput that sets the value only on ENTER, and re-sets
 * the value on ESCAPE. It also provides a custom up/down button controls to
 * increment/decrement the value, which will set the value directly.
 */
export function NumericInput({
  label = '',
  disabled = false,
  hideControls,
  onEnter = () => {},
  value,
  min,
  max,
  step,
  ...props
}: Props) {
  const [storedValue, setStoredValue] = useState(value);

  useEffect(() => {
    setStoredValue(value);
  }, [value]);

  function onKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      onEnter(storedValue);
      event.currentTarget.blur();
    }
    if (event.key === 'Escape') {
      setStoredValue(value);
      event.currentTarget.blur();
    }
  }

  function onValueChange(newValue: number | undefined) {
    if (newValue === undefined) {
      return;
    }
    setStoredValue(newValue);
  }

  function onStep(change: number) {
    const newValue = storedValue + change;
    setStoredValue(newValue);
    onEnter(newValue);
  }

  return (
    <NumberInput
      value={storedValue}
      onKeyUp={onKeyUp}
      onValueChange={(newValue) => onValueChange(newValue.floatValue)}
      disabled={disabled}
      label={label}
      min={min}
      max={max}
      step={step}
      hideControls={hideControls}
      rightSection={
        !hideControls && (
          <NumberStepControls step={step} onChange={(change) => onStep(change)} />
        )
      }
      {...props}
      // TODO: Provide error on invalid input
    />
  );
}
