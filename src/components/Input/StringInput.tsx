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
export function StringInput({
  onEnter,
  onChange,
  onFocus,
  onBlur,
  value,
  errorCheck,
  ...props
}: Props) {
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

  function handleKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      const hasErrorCheck = errorCheck !== undefined;
      const isValueOk = errorCheck && !errorCheck(storedValue);

      // If the value is valid, we want to set it and call the onEnter function
      if (!hasErrorCheck || isValueOk) {
        onEnter(storedValue);
        shouldResetOnBlurRef.current = false;
      }
      // If the value is not valid, we want to reset it to the original value
      else if (hasErrorCheck && !isValueOk) {
        resetValue();
      }
      event.currentTarget.blur();
    }
    if (event.key === 'Escape') {
      event.currentTarget.blur();
    }
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement, Element>) {
    onBlur?.(e);
    if (shouldResetOnBlurRef.current === true) {
      resetValue();
    }
    shouldResetOnBlurRef.current = true;
    setIsEditing(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    onChange?.(e);
    setIsEditing(true);
    setStoredValue(e.currentTarget.value);
  }

  function handleFocus(e: React.FocusEvent<HTMLInputElement, Element>) {
    onFocus?.(e);
    setIsEditing(true);
  }

  return (
    <TextInput
      value={storedValue}
      onChange={handleChange}
      onKeyUp={handleKeyUp}
      onFocus={handleFocus}
      onBlur={handleBlur}
      error={errorCheck ? errorCheck(storedValue) : false}
      {...props}
    />
  );
}
