import { ThemeIcon, ThemeIconProps } from '@mantine/core';

import { WarningIcon as Icon } from '@/icons/icons';
import { IconSize } from '@/types/enums';

import { MaybeTooltip } from '../MaybeTooltip/MaybeTooltip';

interface Props extends ThemeIconProps {
  tooltipText?: string;
  iconSize?: IconSize;
}

export function WarningIcon({ tooltipText, iconSize, ...props }: Props) {
  return (
    <MaybeTooltip showTooltip={tooltipText !== undefined} label={tooltipText}>
      <ThemeIcon color={'orange.4'} variant={'transparent'} {...props}>
        <Icon size={iconSize || IconSize.xs} />
      </ThemeIcon>
    </MaybeTooltip>
  );
}
