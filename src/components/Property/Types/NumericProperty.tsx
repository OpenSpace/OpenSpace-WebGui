import { Flex, Group, NumberFormatter, Paper, Text } from '@mantine/core';

import { NumericInput } from '@/components/Input/NumericInput/NumericInput';
import { NumericSlider } from '@/components/Input/NumericInput/NumericSlider/NumericSlider';
import { validSliderExtent } from '@/components/Input/NumericInput/NumericSlider/util';
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

  const decimalPlaces = stepToDecimalPlaces(step);
  const shouldShowSlider = validSliderExtent(min, max);

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
