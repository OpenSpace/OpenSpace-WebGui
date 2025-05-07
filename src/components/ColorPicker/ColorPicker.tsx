import { useTranslation } from 'react-i18next';
import { ActionIcon, ColorSwatch, Popover, RGBA } from '@mantine/core';

import { rgbaToColor } from '@/util/colorHelper';

import { ColorEdit } from './ColorEdit';

interface Props {
  color: RGBA;
  disabled?: boolean;
  onChange?: (color: RGBA) => void;
  withAlpha: boolean;
}

export function ColorPicker({ color, disabled, onChange, withAlpha }: Props) {
  const { t } = useTranslation('components');

  return (
    <Popover position={'right-end'} withArrow arrowPosition={'center'}>
      <Popover.Target>
        <ActionIcon
          disabled={disabled}
          size={'lg'}
          variant={'subtle'}
          aria-label={t('color-picker.color-swatch-aria-label')}
        >
          <ColorSwatch color={rgbaToColor(color, withAlpha)} />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <ColorEdit color={color} onChange={onChange} withAlpha={withAlpha} />
      </Popover.Dropdown>
    </Popover>
  );
}
