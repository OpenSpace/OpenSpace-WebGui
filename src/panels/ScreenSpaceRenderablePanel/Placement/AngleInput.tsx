import { useEffect, useState } from 'react';
import { AngleSlider, Stack, Text } from '@mantine/core';

interface Props {
  value: number; // Radians
  onChange?: (value: number) => void; // Radians
  disabled?: boolean;
  label?: string;
  ariaLabel?: string;
}

export function AngleInput({ value, onChange, disabled, label, ariaLabel }: Props) {
  const [currentAngle, setCurrentAngle] = useState(radiansToDegrees(value));
  const [isInteracting, setIsInteracting] = useState(false);

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
    <Stack gap={0}>
      <Text size={'sm'}>{label}</Text>
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
    </Stack>
  );
}
