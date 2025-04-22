import { Flex, Group, NumberFormatter, Paper, Text } from '@mantine/core';

import { NumericInput } from '@/components/Input/NumericInput/NumericInput';
import { NumericSlider } from '@/components/Input/NumericInput/NumericSlider/NumericSlider';
import { AdditionalDataNumber, PropertyProps } from '@/components/Property/types';
import { useGenericNumericProperty, usePropertyDescription } from '@/hooks/properties';
import { usePropListeningState } from '@/hooks/util';
import { roundNumberToDecimalPlaces, stepToDecimalPlaces } from '@/util/numeric';

interface Props extends PropertyProps {
  isInt?: boolean;
}

export function NumericProperty({ uri, isInt = false, readOnly }: Props) {
  const [value, setPropertyValue] = useGenericNumericProperty(uri);

  const { value: currentValue, setValue: setCurrentValue } = usePropListeningState<
    number | undefined
  >(value);

  const description = usePropertyDescription(uri);

  if (!description || currentValue === undefined || value === undefined) {
    return <></>;
  }

  const additionalData = description.additionalData as AdditionalDataNumber;
  const {
    MinimumValue: min,
    MaximumValue: max,
    SteppingValue: step,
    Exponent: exponent
  } = additionalData;

  // When no min/max is set, the marks for the slider cannot be nicely computed
  const extent = max - min;
  // @TODO (2025-03-03, emmbr) This should be handled a better way... This is a bit of a
  // hack and the max value is just arbitrarily chosen
  const maxAllowedExtentForSlider = 1e12;
  const shouldShowSlider = isFinite(extent) && extent < maxAllowedExtentForSlider;

  const decimalPlaces = stepToDecimalPlaces(step);

  function onValueChange(newValue: number) {
    setCurrentValue(newValue);
    setPropertyValue(newValue);
  }

  return (
    <Group align={'bottom'}>
      {shouldShowSlider && (
        <NumericSlider
          value={value}
          flex={2}
          miw={100}
          disabled={readOnly}
          min={min}
          max={max}
          step={step}
          exponent={exponent}
          onInput={onValueChange}
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
