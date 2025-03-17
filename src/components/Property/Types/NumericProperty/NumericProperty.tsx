import { Flex, Group, NumberFormatter, Paper, Text } from '@mantine/core';

import {
  useGetPropertyDescription,
  useProperty,
  usePropListeningState
} from '@/api/hooks';
import { NumericInput } from '@/components/Input/NumericInput/NumericInput';

import { PropertyProps } from '../../types';

import { NumericPropertySlider } from './Slider/NumericPropertySlider';
import { roundNumberToDecimalPlaces, stepToDecimalPlaces } from './util';

const propertyTypes = [
  'FloatProperty',
  'DoubleProperty',
  'ShortProperty',
  'UShortProperty',
  'LongProperty',
  'ULongProperty',
  'IntProperty',
  'UIntProperty'
];

type AdditionalData = {
  Exponent: number;
  MaximumValue: number;
  MinimumValue: number;
  SteppingValue: number;
};

interface Props extends PropertyProps {
  isInt?: boolean;
}

export function NumericProperty({ uri, isInt = false }: Props) {
  const [value, setPropertyValue] = useProperty<number>(uri, propertyTypes);

  const { value: currentValue, setValue: setCurrentValue } = usePropListeningState<
    number | undefined
  >(value);

  const description = useGetPropertyDescription(uri);

  if (!description || currentValue === undefined) {
    return <></>;
  }

  const disabled = description?.metaData.isReadOnly;
  const { additionalData } = description as { additionalData: AdditionalData };
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
            value={currentValue}
            valueLabel={(numberValue) =>
              numberValue !== undefined
                ? roundNumberToDecimalPlaces(numberValue, decimalPlaces)
                : ''
            }
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
