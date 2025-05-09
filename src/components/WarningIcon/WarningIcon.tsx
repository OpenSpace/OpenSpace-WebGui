import { ThemeIcon, ThemeIconProps, Tooltip } from '@mantine/core';

import { WarningIcon as Icon } from '@/icons/icons';
import { IconSize } from '@/types/enums';

interface Props extends ThemeIconProps {
  tooltipText: string;
  iconSize?: IconSize;
}

export function WarningIcon({ tooltipText, iconSize, ...props }: Props) {
  return (
    <Tooltip label={tooltipText}>
      <ThemeIcon color={'orange.4'} variant={'transparent'} {...props}>
        <Icon size={iconSize || IconSize.xs} />
      </ThemeIcon>
    </Tooltip>
  );
}
