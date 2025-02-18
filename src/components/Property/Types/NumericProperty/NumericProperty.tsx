import { Flex, Group } from '@mantine/core';

import { usePropListeningState } from '@/api/hooks';
import { NumericInput } from '@/components/Input/NumericInput/NumericInput';
import { PropertyLabel } from '@/components/Property/PropertyLabel';

import { NumericPropertySlider } from './NumericPropertySlider';

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
  const { value: currentValue, set: setCurrentValue } =
    usePropListeningState<number>(value);

  const min = additionalData.MinimumValue;
  const max = additionalData.MaximumValue;
  const step = additionalData.SteppingValue;
  const exponent = additionalData.Exponent;

  const isInt = step >= 1;

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
            decimalScale={5}
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
