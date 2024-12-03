import { ThemeIcon, Tooltip as MantineTooltip } from '@mantine/core';

import { InformationIcon } from '@/icons/icons';

interface TooltipProps {
  text: string;
}

export function Tooltip({ text }: TooltipProps) {
  return (
    <MantineTooltip
      label={text}
      multiline
      w={220}
      withArrow
      transitionProps={{ duration: 400 }}
      offset={{ mainAxis: 5, crossAxis: 100 }}
    >
      <ThemeIcon radius={'xl'} size={'xs'} variant={'default'}>
        <InformationIcon />
      </ThemeIcon>
    </MantineTooltip>
  );
}
