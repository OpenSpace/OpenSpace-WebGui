import { useEffect, useState } from 'react';
import { MdUnfoldMore } from 'react-icons/md';
import { ActionIcon, Box, Group } from '@mantine/core';

import { NumericInput } from '@/components/Input/NumericInput';
import { PropertyLabel } from '@/components/Property/PropertyLabel';

import { NumericPropertySlider } from './Views/Slider';

interface Props {
  name: string;
  description: string;
  disabled: boolean;
  setPropertyValue: (newValue: number) => void;
  value: number;
  additionalData: {
    Exponent: number;
    MaximumValue: number;
    MinimumValue: number;
    SteppingValue: number;
  };
  // TODO: view options in metadata
}

export function NumericProperty({
  name,
  description,
  disabled,
  setPropertyValue,
  value,
  additionalData
}: Props) {
  const [currentValue, setCurrentValue] = useState<number>(value);
  const [currentViewIndex, setCurrentViewIndex] = useState<number>(0);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const min = additionalData.MinimumValue;
  const max = additionalData.MaximumValue;
  const step = additionalData.SteppingValue;
  const exponent = additionalData.Exponent;

  const views = [
    <NumericPropertySlider
      disabled={disabled}
      min={min}
      max={max}
      step={step}
      exponent={exponent}
    />,
    <NumericInput defaultValue={currentValue} disabled={disabled} />
  ];

  return (
    <>
      <PropertyLabel label={name} tip={description} />
      <Group>
        <Box flex={1}>{views[currentViewIndex]}</Box>
        <ActionIcon
          flex={0}
          variant={'default'}
          onClick={() =>
            setCurrentViewIndex(
              currentViewIndex < views.length - 1 ? currentViewIndex + 1 : 0
            )
          }
        >
          <MdUnfoldMore />
        </ActionIcon>
      </Group>
    </>
  );
}
