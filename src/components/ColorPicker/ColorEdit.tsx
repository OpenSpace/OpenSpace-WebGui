import { useEffect, useState } from 'react';
import {
  ColorInput,
  ColorPicker as MantineColorPicker,
  isColorValid,
  RGBA,
  Select,
  Stack,
  toRgba
} from '@mantine/core';
import { ColorFormat } from 'node_modules/@mantine/core/lib/components/ColorPicker/ColorPicker.types';

import { rgbaToColor, rgbaToFormat, toFormat } from '@/util/colorHelper';

interface Props {
  color: RGBA;
  onChange?: (color: RGBA) => void;
  withAlpha: boolean;
}

export function ColorEdit({ color, onChange, withAlpha }: Props) {
  const formats = withAlpha ? ['rgba', 'hexa', 'hsla'] : ['rgb', 'hex', 'hsl'];
  const defaultFormat = withAlpha ? 'rgba' : 'rgb';

  const [format, setFormat] = useState<ColorFormat | undefined>(defaultFormat);
  const [value, setValue] = useState(rgbaToColor(color, withAlpha));
  const [textEditValue, setTextEditValue] = useState(rgbaToColor(color, withAlpha));

  useEffect(() => {
    const updatedColor = rgbaToFormat(color, format || defaultFormat);
    setValue(updatedColor);
    setTextEditValue(updatedColor);
  }, [color, defaultFormat, format]);

  function setTextEditToCurrentFormat(c: string) {
    setTextEditValue(toFormat(c, format || defaultFormat));
  }

  function onColorChange(c: string) {
    setValue(c);
    setTextEditToCurrentFormat(c);
    if (onChange) {
      onChange(toRgba(c));
    }
  }

  const warnAboutInvalidColor = !isColorValid(textEditValue);

  return (
    <Stack gap={'xs'}>
      <MantineColorPicker
        value={value}
        // We don't use the selected format here, since changing the format would
        // lead to the value changing, which would then trigger the onChange event
        format={withAlpha ? 'rgba' : 'rgb'}
        onChange={onColorChange}
      />
      <ColorInput
        value={textEditValue}
        withEyeDropper={false}
        withPicker={false}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.currentTarget.blur();
            if (isColorValid(textEditValue)) {
              onColorChange(textEditValue);
            } else {
              setTextEditToCurrentFormat(value);
            }
          }
        }}
        onChange={setTextEditValue}
        format={format}
        error={warnAboutInvalidColor ? 'Invalid color' : null}
      />
      <Select
        data={formats.map((value) => ({ value, label: value.toUpperCase() }))}
        value={format}
        allowDeselect={false}
        onChange={(value) => setFormat(value! as ColorFormat)}
        // This prevents the menu from closing when selecting a format
        comboboxProps={{ withinPortal: false }}
      />
    </Stack>
  );
}
