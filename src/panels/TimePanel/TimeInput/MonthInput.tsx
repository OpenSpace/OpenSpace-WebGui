import { useEffect, useState } from 'react';
import { MantineStyleProps } from '@mantine/core';

import { StringInput } from '@/components/Input/StringInput';

import { StackedStepControls } from './StackedStepControls';

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

interface Props extends MantineStyleProps {
  month: number;
  onInputChangeStep: (change: number) => void;
  onInputChange: (value: number) => void;
}

export function MonthInput({
  month,
  onInputChange,
  onInputChangeStep,
  ...styleProps
}: Props) {
  const [storedMonth, setStoredMonth] = useState<number>(month);

  useEffect(() => {
    setStoredMonth(month);
  }, [month]);

  function onInput(newValue: string): void {
    const monthIndex = parseMonthTextInput(newValue);
    if (monthIndex !== null) {
      onInputChange(monthIndex);
      setStoredMonth(monthIndex);
    }
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowUp') {
      setStoredMonth(clampMonthIndex(storedMonth + 1));
    }
    if (event.key === 'ArrowDown') {
      setStoredMonth(clampMonthIndex(storedMonth - 1));
    }
  }

  function monthLabel(index: number): string {
    return monthFromIndex(index).substring(0, 3);
  }

  function clampMonthIndex(index: number) {
    return Math.min(11, Math.max(0, index));
  }

  function isValidMonth(index: number | null): boolean {
    if (index === null) {
      return false;
    }
    return index >= 0 && index < Months.length;
  }

  function monthFromIndex(index: number): string {
    // Returns the corresponding month string given the 0-based index
    if (index >= 0 && index < Months.length) {
      return Months[index];
    }
    return ''; // TODO: This should be an error
  }

  function parseMonthTextInput(month: string): number | null {
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

    // Otherwise, try to match the month string with the names of the months
    const matches = Months.filter((m) =>
      m.toLowerCase().startsWith(month.trim().toLowerCase())
    );
    if (matches.length > 1) {
      return null; // Ambiguous month (more than one match)
    }
    return Months.indexOf(matches[0]);
  }

  return (
    <StackedStepControls onChange={onInputChangeStep}>
      <StringInput
        value={monthLabel(storedMonth)}
        onEnter={onInput}
        onKeyDown={onKeyDown}
        errorCheck={(value) => !isValidMonth(parseMonthTextInput(value))}
        {...styleProps}
      />
    </StackedStepControls>
  );
}
