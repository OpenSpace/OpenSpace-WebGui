import { useState } from 'react';
import { MantineStyleProp, NumberInput } from '@mantine/core';

import { HoldableButton } from './HoldableButton';

interface Props {
  value: number;
  onInputChange: (value: number, relative: boolean, interpolate: boolean) => void;
  min?: number;
  max?: number;
  step?: number;
  style?: MantineStyleProp;
}

export function InlineInput({ value, onInputChange, min, max, step, style }: Props) {
  const [storedValue, setStoredValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  // If we are not editing we can update the value and re-render
  if (storedValue !== value && !isFocused) {
    setStoredValue(value);
  }

  // Similar to `NumericInput` component
  function onKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      // onEnter(storedValue);
      onInputChange(storedValue, false, false);
      event.currentTarget.blur();
    }
    if (event.key === 'Escape') {
      event.currentTarget.blur();
    }
  }

  function onValueChange(newValue: number | string) {
    if (typeof newValue === 'number') {
      // onValueChange is called on every keyboard stroke, we only call the onUpdate
      // function when user hits 'Enter' key.
      setStoredValue(newValue);
    }
  }

  function onBlur() {
    setIsFocused(false);
  }

  function onFocus() {
    setIsFocused(true);
  }

  const buttonControls = (
    <HoldableButton
      stepHoldDelay={500}
      stepHoldInterval={50}
      onChange={(value, shiftKey) => onInputChange(value, true, !shiftKey)}
    />
  );

  return (
    <NumberInput
      value={storedValue}
      rightSection={buttonControls}
      onKeyUp={onKeyUp}
      onChange={(val) => onValueChange(val)}
      onFocus={onFocus}
      onBlur={onBlur}
      min={min}
      max={max}
      step={step}
      stepHoldDelay={500}
      stepHoldInterval={50}
      clampBehavior={'strict'}
      style={style}
    />
  );
}
