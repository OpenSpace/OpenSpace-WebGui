import { useRef } from 'react';
import { NumberInput, NumberInputProps } from '@mantine/core';

import { usePropListeningState } from '@/api/hooks';

import { NumberStepControls } from './NumberStepControls';

interface Props extends NumberInputProps {
  // The function to call when the user hits the ENTER key or presses the UP/DOWN buttons
  onEnter?: (newValue: number) => void;
  // The value of the input. In contrast to the original NumberInput, we here only allow
  // numbers, not strings
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
  const {
    value: storedValue,
    setValue: setStoredValue,
    setIsEditing
  } = usePropListeningState<number | undefined>(value);

  const shouldClamp = props.clampBehavior === 'strict';
  const shouldClampMin = shouldClamp && min !== undefined;
  const shouldClampMax = shouldClamp && max !== undefined;

  // We only want to reset the value on blur if the user didn't hit ENTER.
  // This ref keeps track of that
  const shouldResetOnBlurRef = useRef(true);

  function resetValue() {
    setStoredValue(value);
  }

  function onKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      if (storedValue !== undefined) {
        shouldResetOnBlurRef.current = false;
        onEnter(storedValue);
      } else {
        resetValue();
      }
      event.currentTarget.blur();
    }
    if (event.key === 'Escape') {
      event.currentTarget.blur();
    }
  }

  function onBlur() {
    if (shouldResetOnBlurRef.current === true) {
      resetValue();
    }
    shouldResetOnBlurRef.current = true;
    setIsEditing(false);
  }

  function onStep(change: number) {
    if (storedValue === undefined) {
      return;
    }
    let newValue = storedValue + change;
    if (shouldClampMin && newValue < min) {
      newValue = min;
    } else if (shouldClampMax && newValue > max) {
      newValue = max;
    }
    setStoredValue(newValue);
    onEnter(newValue);
  }

  return (
    <NumberInput
      value={storedValue === undefined ? '' : storedValue}
      onKeyUp={onKeyUp}
      onBlur={onBlur}
      onFocus={() => setIsEditing(true)}
      onValueChange={(newValue) => {
        setStoredValue(newValue.floatValue);
      }}
      onChange={() => setIsEditing(true)}
      disabled={disabled}
      label={label}
      min={min}
      max={max}
      step={step}
      hideControls={hideControls}
      rightSection={
        !hideControls && (
          <NumberStepControls
            step={step}
            disableMin={shouldClampMin && storedValue !== undefined && storedValue <= min}
            disableMax={shouldClampMax && storedValue !== undefined && storedValue >= max}
            onChange={onStep}
          />
        )
      }
      {...props}
      // TODO: Provide error on invalid input
    />
  );
}
