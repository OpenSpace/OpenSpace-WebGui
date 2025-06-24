import { MantineStyleProps } from '@mantine/core';

import { StringInput } from '@/components/Input/StringInput';
import { usePropListeningState } from '@/hooks/util';

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
  disabled?: boolean;
}

export function MonthInput({
  month,
  onInputChange,
  onInputChangeStep,
  disabled,
  ...styleProps
}: Props) {
  const { value: storedMonth, setValue: setStoredMonth } = usePropListeningState(month);

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
    if (!isValidMonth(index)) {
      throw new Error('Invalid month index');
    }
    return Months[index].substring(0, 3);
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
    const index = Months.findIndex((m) =>
      m.toLowerCase().startsWith(month.trim().toLowerCase())
    );
    return index === -1 ? null : index;
  }

  return (
    <StackedStepControls onChange={onInputChangeStep} disabled={disabled}>
      <StringInput
        value={monthLabel(storedMonth)}
        onEnter={onInput}
        onKeyDown={onKeyDown}
        errorCheck={(value) => !isValidMonth(parseMonthTextInput(value))}
        disabled={disabled}
        {...styleProps}
      />
    </StackedStepControls>
  );
}
