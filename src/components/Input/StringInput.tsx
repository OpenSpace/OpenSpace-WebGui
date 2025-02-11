import { useEffect, useState } from 'react';
import { TextInput, TextInputProps } from '@mantine/core';

export interface Props extends TextInputProps {
  onEnter: (newValue: string) => void;
  value: string;
  errorCheck?: (value: string) => boolean;
}

/**
 * This is a version of the text input that sets the value only on ENTER, and re-sets
 * the value on ESCAPE.
 */
export function StringInput({ onEnter, value, errorCheck, ...props }: Props) {
  const [storedValue, setStoredValue] = useState<string>(value);
  let valueWasEntered = false;

  useEffect(() => {
    setStoredValue(value);
  }, [value]);

  function resetValue() {
    setStoredValue(value);
  }

  function onKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      if (!errorCheck || !errorCheck(storedValue)) {
        onEnter(storedValue);
        valueWasEntered = true;
      }
      event.currentTarget.blur();
    }
    if (event.key === 'Escape') {
      event.currentTarget.blur();
    }
  }

  function onBlur() {
    if (!valueWasEntered) {
      resetValue();
    }
  }

  return (
    <TextInput
      value={storedValue}
      onChange={(event) => setStoredValue(event.currentTarget.value)}
      onKeyUp={onKeyUp}
      onBlur={onBlur}
      error={errorCheck ? errorCheck(storedValue) : false}
      {...props}
      // TODO: Provide error on invalid input
    />
  );
}
