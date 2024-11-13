import { useState } from 'react';
import { TextInput } from '@mantine/core';


interface Props {
  label?: React.ReactNode | string;
  disabled?: boolean;
  onEnter: (newValue: string) => void;
  defaultValue: string;
}

/**
 * This is a version of the text input that sets the value only on ENTER, and re-sets
 * the value on ESCAPE.
 */
export function StringInput({
  label = "",
  disabled = false,
  onEnter,
  defaultValue
}: Props) {
  const [currentValue, setCurrentValue] = useState<string>(defaultValue);
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

  return (
    <TextInput
      value={currentValue}
      onChange={(event) => setCurrentValue(event.currentTarget.value)}
      onKeyUp={(event) => onKeyUp(event)}
      onBlur={onBlur}
      disabled={disabled}
      label={label}
    // TODO: Provide error on invalid input
    />
  );
}
