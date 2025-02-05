import { useEffect, useState } from 'react';
import { NumberInput } from '@mantine/core';
import { useTimeout } from '@mantine/hooks';

interface Props {
  label?: React.ReactNode | string;
  disabled?: boolean;
  onEnter?: (newValue: number) => void;
  defaultValue: number;
  min?: number;
  max?: number;
  step?: number;
}

/**
 * This is a version of the number input that sets the value only on ENTER, and re-sets
 * the value on ESCAPE.
 */
export function NumericInput({
  label = '',
  disabled = false,
  onEnter = () => {},
  defaultValue,
  min,
  max,
  step
}: Props) {
  const [currentValue, setCurrentValue] = useState<number>(defaultValue);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const { start: startIsTypingTimout, clear: clearIsTypingTimout } = useTimeout(
    () => setIsTyping(false),
    200
  );

  useEffect(() => {
    setCurrentValue(defaultValue);
  }, [defaultValue]);

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

  function onKeyDown() {
    setIsTyping(true);
    clearIsTypingTimout();
    startIsTypingTimout();
  }

  function onBlur() {
    if (!valueWasSet) {
      setCurrentValue(defaultValue);
    }
  }

  function onValueChange(newValue: number | undefined) {
    if (newValue === undefined) {
      return;
    }
    setCurrentValue(newValue);

    if (!isTyping) {
      onEnter(newValue);
    }
  }

  return (
    <NumberInput
      value={currentValue}
      onKeyUp={onKeyUp}
      onKeyDown={onKeyDown}
      onValueChange={(v) => onValueChange(v.floatValue)}
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
