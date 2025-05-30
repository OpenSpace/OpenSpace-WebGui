import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { NumberInput, NumberInputProps } from '@mantine/core';

import { WarningIcon } from '@/components/WarningIcon/WarningIcon';
import { usePropListeningState } from '@/hooks/util';

import { NumberStepControls } from './NumberStepControls';

interface Props extends NumberInputProps {
  // The function to call when the user hits the ENTER key or presses the UP/DOWN buttons
  onEnter?: (newValue: number) => void;
  // The value of the input. In contrast to the original NumberInput, we here only allow
  // numbers, not strings
  value: number;
  // An function that based on the current value can be used to display and alternative
  // string. Only applied when the value is not being edited
  valueLabel?: (value: number | undefined) => string;
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
  onChange,
  onBlur,
  value,
  min,
  max,
  step,
  valueLabel,
  ...props
}: Props) {
  const {
    value: storedValue,
    setValue: setStoredValue,
    setIsEditing,
    isEditing
  } = usePropListeningState<number | undefined>(value);
  const { t } = useTranslation('components', { keyPrefix: 'input.numeric-input' });

  const shouldClamp = props.clampBehavior === 'strict';

  const hasMin = min !== undefined;
  const hasMax = max !== undefined;
  const hasValue = storedValue !== undefined;

  const shouldClampMin = shouldClamp && hasMin;
  const shouldClampMax = shouldClamp && hasMax;

  const isBelowMin = hasValue && hasMin && storedValue < min;
  const isAboveMax = hasValue && hasMax && storedValue > max;
  const isOutsideRange = isBelowMin || isAboveMax;

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

  function handleBlur(event: React.FocusEvent<HTMLInputElement, Element>) {
    if (shouldResetOnBlurRef.current === true) {
      resetValue();
    }
    shouldResetOnBlurRef.current = true;
    setIsEditing(false);
    onBlur?.(event);
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

  function handleChange(value: number | string): void {
    setIsEditing(true);
    onChange?.(value);
  }

  const shouldFormatValue = !isEditing && valueLabel !== undefined;

  // @TODO (2025-02-18, emmbr): This input type does not support scientific notation...
  return (
    <NumberInput
      value={shouldFormatValue ? valueLabel(value) : storedValue}
      onKeyUp={onKeyUp}
      onBlur={handleBlur}
      onValueChange={(newValue) => {
        setStoredValue(newValue.floatValue);
      }}
      onChange={handleChange}
      onFocus={() => setIsEditing(true)}
      disabled={disabled}
      label={label}
      min={min}
      max={max}
      step={step}
      hideControls={hideControls}
      leftSection={
        isOutsideRange &&
        !isEditing && <WarningIcon tooltipText={`Value outside range [${min}, ${max}]`} />
      }
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
      error={isOutsideRange && isEditing ? t('error-label', { min, max }) : undefined}
      {...props}
      // TODO: Provide error on invalid input
    />
  );
}
