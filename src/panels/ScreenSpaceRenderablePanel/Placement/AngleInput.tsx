import { useEffect, useState } from 'react';
import { AngleSlider, Group, Stack } from '@mantine/core';
import { useThrottledCallback } from '@mantine/hooks';

import { NumericInput } from '@/components/Input/NumericInput/NumericInput';

interface Props {
  value: number; // Radians
  onChange?: (value: number) => void; // Radians
  disabled?: boolean;
  label?: React.ReactNode;
  ariaLabel?: string;
}

export function AngleInput({ value, onChange, disabled, label, ariaLabel }: Props) {
  const [currentAngle, setCurrentAngle] = useState(radiansToDegrees(value));
  const [isInteracting, setIsInteracting] = useState(false);
  const throttledNumberInputChange = useThrottledCallback((numericValue: number) => {
    onChange?.(degreesToRadians(numericValue));
  }, 300);

  function radiansToDegrees(radians: number) {
    return (radians * 180) / Math.PI;
  }

  function degreesToRadians(degrees: number) {
    return (degrees * Math.PI) / 180;
  }

  useEffect(() => {
    if (!isInteracting) {
      setCurrentAngle(radiansToDegrees(value));
    }
  }, [value, isInteracting]);

  return (
    <Stack gap={2} flex={1} align={'center'}>
      {label}
      <Group align={'center'} justify={'center'} gap={5}>
        <AngleSlider
          marks={[
            { value: 0 },
            { value: 45 },
            { value: 90 },
            { value: 135 },
            { value: 180 },
            { value: 225 },
            { value: 270 },
            { value: 315 }
          ]}
          size={50}
          value={currentAngle}
          onChange={(newValue) => {
            setIsInteracting(true);
            setCurrentAngle(newValue);
            onChange?.(degreesToRadians(newValue));
          }}
          onChangeEnd={() => setIsInteracting(false)}
          formatLabel={(labelValue) => `${Math.round(labelValue)}°`}
          disabled={disabled}
          aria-label={ariaLabel}
        />
        <NumericInput
          value={currentAngle}
          flex={1}
          miw={50}
          maw={80}
          size={'xs'}
          min={-360}
          max={360}
          step={1}
          decimalScale={1}
          onChange={() => setIsInteracting(true)}
          onEnter={(newValue) => {
            const numericValue = Number(newValue);
            if (numericValue === undefined) {
              return;
            }
            setCurrentAngle(numericValue);
            throttledNumberInputChange(numericValue);
          }}
          onFocus={() => setIsInteracting(true)}
          onBlur={() => setIsInteracting(false)}
          disabled={disabled}
          aria-label={ariaLabel}
        />
      </Group>
    </Stack>
  );
}
