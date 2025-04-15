import { Flex, Group, NumberFormatter, Paper, Text } from '@mantine/core';

import { NumericInput } from '@/components/Input/NumericInput/NumericInput';
import { PropertyProps } from '@/components/Property/types';
import { usePropListeningState } from '@/hooks/util';

import { NumericPropertySlider } from './Slider/NumericPropertySlider';
import { roundNumberToDecimalPlaces, stepToDecimalPlaces } from './util';
import { useProperty } from '@/hooks/properties';

interface Props extends PropertyProps {
  isInt?: boolean;
}

export function NumericProperty({ uri, isInt = false, readOnly }: Props) {
  const [value, setPropertyValue, meta] = useProperty('GenericNumericProperty', uri);

  const { value: currentValue, setValue: setCurrentValue } = usePropListeningState<
    number | undefined
  >(value);

  if (!meta || currentValue === undefined || value === undefined) {
    return <></>;
  }

  const {
    MinimumValue: min,
    MaximumValue: max,
    SteppingValue: step,
    Exponent: exponent
  } = meta.additionalData;

  // When no min/max is set, the marks for the slider cannot be nicely computed
  const extent = max - min;
  // @TODO (2025-03-03, emmbr) This should be handled a better way... This is a bit of a
  // hack and the max value is just arbitrarily chosen
  const maxAllowedExtentForSlider = 1e12;
  const shouldShowSlider = isFinite(extent) && extent < maxAllowedExtentForSlider;

  const decimalPlaces = stepToDecimalPlaces(step);

  // @TODO (2025-03-14, emmbr) There still seems to be a bit of a stutter when dragging
  // the slider. Investigate.
  function onValueChange(newValue: number) {
    setCurrentValue(newValue);
    setPropertyValue(newValue);
  }

  return (
    <Group align={'bottom'}>
      {shouldShowSlider && (
        <NumericPropertySlider
          value={value}
          flex={2}
          miw={100}
          disabled={readOnly}
          min={min}
          max={max}
          step={step}
          exponent={exponent}
          onInput={setPropertyValue}
        />
      )}
      <Flex flex={1} miw={100}>
        {readOnly ? (
          <Paper px={'sm'} py={5} flex={1}>
            <Text size={'sm'}>
              <NumberFormatter
                value={roundNumberToDecimalPlaces(currentValue, decimalPlaces)}
              />
            </Text>
          </Paper>
        ) : (
          <NumericInput
            value={currentValue}
            valueLabel={(numberValue) =>
              numberValue !== undefined
                ? roundNumberToDecimalPlaces(numberValue, decimalPlaces)
                : ''
            }
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
