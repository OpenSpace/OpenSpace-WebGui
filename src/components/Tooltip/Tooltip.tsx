import { IoInformationCircleOutline } from 'react-icons/io5';
import { ThemeIcon,Tooltip as MantineTooltip } from '@mantine/core';

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
      <ThemeIcon radius={'xl'} size={'sm'}>
        <IoInformationCircleOutline style={{ width: '80%', height: '80%' }} />
      </ThemeIcon>
    </MantineTooltip>
  );
}
