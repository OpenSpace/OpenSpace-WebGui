import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RGBA } from '@mantine/core';
import { isNumber } from 'lodash';

import { ColorPicker } from '@/components/ColorPicker/ColorPicker';
import { StringInput } from '@/components/Input/StringInput';
import { WarningIcon } from '@/components/WarningIcon/WarningIcon';
import { AdditionalDataVectorMatrix } from '@/types/Property/propertyTypes';
import { openspaceColorToRgba, toOpenspaceColor } from '@/util/colorHelper';

function validateInput(
  value: number[],
  additionalData: AdditionalDataVectorMatrix,
  isInt: boolean
) {
  if ((value.length !== 3 && value.length !== 4) || isInt) {
    throw Error('Invalid use of Color view option!');
  }
  if (!additionalData.max.every((v) => v === 1)) {
    throw Error('Color view option only supports maximum values of 1!');
  }
  if (!additionalData.min.every((v) => v === 0)) {
    throw Error('Color view option only supports minimum values of 0!');
  }
}

interface Props {
  setPropertyValue: (value: number[]) => void;
  value: number[];
  additionalData: AdditionalDataVectorMatrix;
  readOnly: boolean;
  isInt: boolean;
}

export function ColorView({
  readOnly,
  setPropertyValue,
  value,
  additionalData,
  isInt
}: Props) {
  const [isError, setIsError] = useState(false);
  const { t } = useTranslation('components', {
    keyPrefix: 'property.vector-property.color-view'
  });

  const isOutsideRange = value.some((v) => v < 0 || v > 1);
  const currentColor: RGBA = openspaceColorToRgba(value);
  const hasAlpha = value.length === 4;
  const valueDisplayString = value
    .map((v) => parseFloat(v.toFixed(3)).toString())
    .join(', ');

  validateInput(value, additionalData, isInt);

  function isValidColorString(colorString: string): boolean {
    const newValues = colorString.split(',').map((v) => parseFloat(v));
    const validLength = newValues.length === value.length;
    const validNumbers = newValues.every((v) => !isNaN(v) && isNumber(v));

    return validLength && validNumbers;
  }

  function onColorPickerChange(color: RGBA) {
    const newValue = toOpenspaceColor(color, hasAlpha);
    setPropertyValue(newValue);

    setIsError(!isValidColorString(newValue.join(', ')));
  }

  function handleEnter(newValue: string) {
    const newNumberValue = newValue.split(',').map((v) => parseFloat(v));
    setPropertyValue(newNumberValue);
  }

  function handleInputChange(newValue: string) {
    const isValid = isValidColorString(newValue);
    setIsError(!isValid);
  }

  function handleBlur() {
    setIsError(!isValidColorString(value.join(', ')));
  }

  return (
    <StringInput
      onEnter={handleEnter}
      onInput={(e) => handleInputChange(e.currentTarget.value)}
      value={valueDisplayString}
      error={isError}
      leftSection={
        <ColorPicker
          color={currentColor}
          withAlpha={hasAlpha}
          onChange={onColorPickerChange}
        />
      }
      onBlur={handleBlur}
      readOnly={readOnly}
      rightSection={
        isOutsideRange && (
          <WarningIcon
            tooltipText={t('outside-range', {
              min: additionalData.min,
              max: additionalData.max
            })}
          />
        )
      }
      placeholder={hasAlpha ? t('placeholder-rgba') : t('placeholder-rgb')}
      errorCheck={(value: string) => !isValidColorString(value)}
    />
  );
}
