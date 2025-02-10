import { useRef, useState } from 'react';
import { TextInput, TextInputProps } from '@mantine/core';

import { StepControlButtons } from './StepControls';

const Months: string[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

interface MonthProps extends TextInputProps {
  month: number;
  onInputChange: (value: number, relative: boolean, interpolate: boolean) => void;
}
export function MonthInput({ month, onInputChange, style, ...props }: MonthProps) {
  const [storedMonth, setStoredMonth] = useState<number>(month);
  const [inputValue, setInputValue] = useState<string>('');
  const [isFocused, setIsFocused] = useState(false);

  const monthLabel = getMonthFromIndex(storedMonth).substring(0, 3);

  // Ref is used to get access to the latest value in the `onKeyDown` callbacks
  const storedMonthRef = useRef(month);

  // If we are not editing we can update the value and re-render
  if (storedMonth !== month && !isFocused) {
    setStoredMonth(month);
  }

  function onKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      const monthIndex = getIndexForMonth(inputValue);
      if (monthIndex !== null) {
        onInputChange(monthIndex, false, false);
        event.currentTarget.blur();
      }
    }
    if (event.key === 'Escape') {
      event.currentTarget.blur();
    }
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowUp') {
      const newIndex = clampMonthIndex(storedMonthRef.current + 1);
      storedMonthRef.current = newIndex;
      setInputValue(getMonthFromIndex(newIndex).substring(0, 3));
    }
    if (event.key === 'ArrowDown') {
      const newIndex = clampMonthIndex(storedMonthRef.current - 1);
      storedMonthRef.current = newIndex;
      setInputValue(getMonthFromIndex(newIndex).substring(0, 3));
    }
  }

  function onBlur(): void {
    setIsFocused(false);
  }

  function onFocus(): void {
    // We want to start editing using the same value shown right before user clicked
    setInputValue(monthLabel);
    setIsFocused(true);
  }

  function onValueChange(newValue: string): void {
    setInputValue(newValue);
  }

  function clampMonthIndex(newIndex: number) {
    if (newIndex < 0) {
      return 0;
    } else if (newIndex > 11) {
      return 11;
    }
    return newIndex;
  }

  function getMonthFromIndex(index: number): string {
    // Returns the corresponding month string given the 0-based index
    if (index >= 0 && index < Months.length) {
      return Months[index];
    }
    return '';
  }

  function getIndexForMonth(month: string): number | null {
    // Parse the input value and return the correspondning 0-based month index
    const monthIndex = Number.parseInt(month);
    const isNumber = !Number.isNaN(monthIndex);
    if (isNumber) {
      // Assume that people use 1-indexed months
      if (monthIndex > 0 && monthIndex <= 12) {
        return monthIndex - 1;
      }
      return null; // Index out of range
    }
    const index = Months.findIndex((m) =>
      m.toLowerCase().startsWith(month.toLowerCase())
    );
    return index !== -1 ? index : null;
  }

  return (
    <StepControlButtons
      stepHoldDelay={500}
      stepHoldInterval={50}
      onChange={(change, shiftKey) => {
        onInputChange(change, true, !shiftKey);
      }}
    >
      <TextInput
        value={isFocused ? inputValue : monthLabel}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={(event) => onValueChange(event.currentTarget.value)}
        onKeyUp={onKeyUp}
        onKeyDown={onKeyDown}
        style={style}
        {...props}
      />
    </StepControlButtons>
  );
}
