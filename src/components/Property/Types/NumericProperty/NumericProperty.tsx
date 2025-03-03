import { Flex, Group } from '@mantine/core';

import { usePropListeningState } from '@/api/hooks';
import { NumericInput } from '@/components/Input/NumericInput/NumericInput';
import { PropertyLabel } from '@/components/Property/PropertyLabel';

import { NumericPropertySlider } from './NumericPropertySlider';

export interface NumericPropertyProps {
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
}

interface Props extends NumericPropertyProps {
  isInt?: boolean;
}

export function NumericProperty({
  name,
  description,
  disabled,
  setPropertyValue,
  value,
  additionalData,
  isInt = false
}: Props) {
  const { value: currentValue, setValue: setCurrentValue } =
    usePropListeningState<number>(value);

  const min = additionalData.MinimumValue;
  const max = additionalData.MaximumValue;
  const step = additionalData.SteppingValue;
  const exponent = additionalData.Exponent;

  // When no min/max is set, the marks for the slider cannot be nicely computed
  const hasNiceMinMax = isFinite(max - min);

  // @TODO There still seems to be a bit of a stutter when dragging the slider.
  // nvestigate. Is there somethign we could memo to make it better?
  function onValueChange(newValue: number) {
    setCurrentValue(newValue);
    setPropertyValue(newValue);
  }

  // @TODO warn if out of bounds?
  return (
    <>
      <PropertyLabel label={name} tip={description} />
      <Group align={'bottom'}>
        {hasNiceMinMax && (
          <NumericPropertySlider
            value={currentValue}
            flex={2}
            miw={100}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            exponent={exponent}
            onInput={onValueChange}
          />
        )}
        <Flex flex={1} miw={100}>
          <NumericInput
            value={currentValue}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            allowDecimal={!isInt}
            onEnter={onValueChange}
          />
        </Flex>
      </Group>
    </>
  );
}
