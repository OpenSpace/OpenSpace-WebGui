import { ColorInput } from '@mantine/core';

import { AdditionalDataVectorMatrix } from '@/components/Property/types';

interface Props {
  setPropertyValue: (value: number[]) => void;
  value: number[];
  additionalData: AdditionalDataVectorMatrix;
  readOnly: boolean;
  isInt: boolean;
}

// @TODO (ylvse 2025-03-23): Do something smarter with these colors?
//
const swatchesRgb = [
  'rgb(250, 82, 82)',
  'rgb(230, 73, 128)',
  'rgb(190, 75, 219)',
  'rgb(121, 80, 242)',
  'rgb(76, 110, 245)',
  'rgb(34, 139, 230)',
  'rgb(21, 170, 191)',
  'rgb(18, 184, 134)',
  'rgb(64, 192, 87)',
  'rgb(130, 201, 30)',
  'rgb(250, 176, 5)',
  'rgb(253, 126, 20)'
];

const swatchesRgba = [
  'rgba(250, 82, 82, 1)',
  'rgba(230, 73, 128, 1)',
  'rgba(190, 75, 219, 1)',
  'rgba(121, 80, 242, 1)',
  'rgba(76, 110, 245, 1)',
  'rgba(34, 139, 230, 1)',
  'rgba(21, 170, 191, 1)',
  'rgba(18, 184, 134, 1)',
  'rgba(64, 192, 87, 1)',
  'rgba(130, 201, 30, 1)',
  'rgba(250, 176, 5, 1)',
  'rgba(253, 126, 20, 1)'
];

export function ColorView({
  readOnly,
  setPropertyValue,
  value,
  additionalData,
  isInt
}: Props) {
  if ((value.length !== 3 && value.length !== 4) || isInt) {
    throw Error('Invalid use of Color view option!');
  }
  if (!additionalData.MaximumValue.every((v) => v === 1)) {
    throw Error('Color view option only supports values between 0 and 1!');
  }
  if (!additionalData.MinimumValue.every((v) => v === 0)) {
    throw Error('Color view option only supports values between 0 and 1!');
  }
  const hasAlpha = value.length === 4;
  const colorString = value.map((v) => (v * 255).toFixed(0)).join(', ');
  return (
    <ColorInput
      format={hasAlpha ? 'rgba' : 'rgb'}
      value={hasAlpha ? `rgba(${colorString})` : `rgb(${colorString})`}
      withEyeDropper={false}
      onChange={(value) => {
        const result = value.replace(hasAlpha ? 'rgba(' : 'rgb(', '').replace(')', '');
        setPropertyValue(result.split(',').map((v) => parseFloat(v.trim()) / 255));
      }}
      disabled={readOnly}
      swatches={hasAlpha ? swatchesRgba : swatchesRgb}
      swatchesPerRow={6}
    />
  );
}
