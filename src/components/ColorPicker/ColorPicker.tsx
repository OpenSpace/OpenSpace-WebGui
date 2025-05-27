import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActionIcon,
  ColorInput,
  ColorPicker as MantineColorPicker,
  ColorSwatch,
  isColorValid,
  Popover,
  RGBA,
  Select,
  Stack
} from '@mantine/core';
import { ColorFormat } from 'node_modules/@mantine/core/lib/components/ColorPicker/ColorPicker.types';

import { IconSize } from '@/types/enums';
import { rgbaToColor, rgbaToFormat, rgbStringToRgba, toFormat } from '@/util/colorHelper';

import styles from './ColorPicker.module.css';

// @TODO (ylvse 2025-03-23): Do something smarter with these colors?
// These are the rgb / rgba versions of Mantines default colors
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

interface Props {
  color: RGBA;
  disabled?: boolean;
  onChange?: (color: RGBA) => void;
  withAlpha: boolean;
}

export function ColorPicker({ color, disabled, onChange, withAlpha }: Props) {
  const defaultFormat = withAlpha ? 'rgba' : 'rgb';

  const [format, setFormat] = useState<ColorFormat>(defaultFormat);
  const [value, setValue] = useState(rgbaToColor(color, withAlpha));
  const [textEditValue, setTextEditValue] = useState(rgbaToColor(color, withAlpha));
  const { t } = useTranslation('components', { keyPrefix: 'color-picker' });

  const formats = withAlpha ? ['rgba', 'hexa', 'hsla'] : ['rgb', 'hex', 'hsl'];

  useEffect(() => {
    const updatedColor = rgbaToFormat(color, format || defaultFormat);
    setValue(updatedColor);
    setTextEditValue(updatedColor);
  }, [color, defaultFormat, format]);

  function setTextEditToCurrentFormat(c: string) {
    setTextEditValue(toFormat(c, format || defaultFormat));
  }

  function onColorChange(c: string) {
    //@TODO (emmbr, 2025-03-14) Verify that the color is valid
    setValue(c);
    setTextEditToCurrentFormat(c);
    if (onChange) {
      // Convert the color string to RGBA format
      // @TODO (ylvse, 2025-05-27): We could use the `toRgba` function from Mantine here,
      // but it has a bug right now where the alpha value is set to 1 if the alpha value is set to 0.
      // This is a workaround for that bug. Once the bug is fixed, we can use that function instead.
      // Track here https://github.com/mantinedev/mantine/pull/7906
      onChange(rgbStringToRgba(c));
    }
  }

  const warnAboutInvalidColor = !isColorValid(textEditValue);

  return (
    <Popover position={'right-end'} withArrow arrowPosition={'center'} trapFocus={true}>
      <Popover.Target>
        <ActionIcon
          disabled={disabled}
          size={'lg'}
          variant={'transparent'}
          flex={0}
          aria-label={t('color-swatch-aria-label')}
        >
          <ColorSwatch size={IconSize.sm} color={rgbaToColor(color, withAlpha)} />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack gap={'xs'}>
          <MantineColorPicker
            value={value}
            // We don't use the selected format here, since changing the format would
            // lead to the value changing, which would then trigger the onChange event
            format={withAlpha ? 'rgba' : 'rgb'}
            onChange={onColorChange}
            swatches={withAlpha ? swatchesRgba : swatchesRgb}
            swatchesPerRow={12}
            classNames={{
              thumb: styles.thumb,
              slider: styles.slider,
              saturation: styles.saturation,
              swatch: styles.swatch
            }}
          />
          <ColorInput
            data-autofocus
            value={textEditValue}
            // Disable eye dropper as this will not work when running the UI in OpenSpace
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
      </Popover.Dropdown>
    </Popover>
  );
}
