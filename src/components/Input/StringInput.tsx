import { useRef } from 'react';
import { TextInput, TextInputProps } from '@mantine/core';

import { usePropListeningState } from '@/hooks/util';

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
  const {
    value: storedValue,
    setValue: setStoredValue,
    setIsEditing
  } = usePropListeningState<string>(value);

  // We only want to reset the value on blur if the user didn't hit ENTER.
  // This ref keeps track of that
  const shouldResetOnBlurRef = useRef(true);

  function resetValue() {
    setStoredValue(value);
  }

  function onKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      if (!errorCheck || !errorCheck(storedValue)) {
        onEnter(storedValue);
        shouldResetOnBlurRef.current = false;
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

  function onChange(value: string): void {
    setIsEditing(true);
    setStoredValue(value);
  }

  return (
    <TextInput
      value={storedValue}
      onChange={(event) => onChange(event.currentTarget.value)}
      onKeyUp={onKeyUp}
      onFocus={() => setIsEditing(true)}
      onBlur={onBlur}
      error={errorCheck ? errorCheck(storedValue) : false}
      {...props}
    />
  );
}
