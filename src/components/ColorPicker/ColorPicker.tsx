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
  return (
    <Popover position={'right-end'} withArrow arrowPosition={'center'}>
      <Popover.Target>
        <ActionIcon
          disabled={disabled}
          size={'lg'}
          variant={'subtle'}
          aria-label={'Open color edit'}
          flex={0}
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
