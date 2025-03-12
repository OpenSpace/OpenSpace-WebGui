import { Flex, Group, NumberFormatter, Paper, Text } from '@mantine/core';

import { usePropListeningState } from '@/api/hooks';
import { NumericInput } from '@/components/Input/NumericInput/NumericInput';

import { ConcretePropertyBaseProps } from '../../types';

import { NumericPropertySlider } from './Slider/NumericPropertySlider';
import { roundNumberToDecimalPlaces, stepToDecimalPlaces } from './util';

export interface NumericPropertyProps extends ConcretePropertyBaseProps {
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
  const extent = max - min;
  // @TODO (202503-03, emmbr) This should be handled a better way...
  const maxAllowedExtentForSlider = 10e12;
  const shouldShowSlider = isFinite(extent) && extent < maxAllowedExtentForSlider;

  const decimalPlaces = stepToDecimalPlaces(step);

  // @TODO There still seems to be a bit of a stutter when dragging the slider.
  // nvestigate. Is there somethign we could memo to make it better?
  function onValueChange(newValue: number) {
    setCurrentValue(newValue);
    setPropertyValue(newValue);
  }

  // @TODO warn if out of bounds?
  return (
    <Group align={'bottom'}>
      {shouldShowSlider && (
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
        {disabled ? (
          <Paper px={'sm'} py={5} flex={1}>
            <Text size={'sm'}>
              <NumberFormatter
                value={roundNumberToDecimalPlaces(currentValue, decimalPlaces)}
              />
            </Text>
          </Paper>
        ) : (
          <NumericInput
            value={roundNumberToDecimalPlaces(currentValue, decimalPlaces)}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            allowDecimal={!isInt}
            onEnter={onValueChange}
            flex={1}
          />
        )}
      </Flex>
    </Group>
  );
}
