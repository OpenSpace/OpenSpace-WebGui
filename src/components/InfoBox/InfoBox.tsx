import { ThemeIcon, Tooltip } from '@mantine/core';

import { InformationIcon } from '@/icons/icons';

interface Props {
  text: React.ReactNode;
}

export function InfoBox({ text }: Props) {
  return (
    <Tooltip
      label={text}
      multiline
      w={220}
      withArrow
      transitionProps={{ duration: 400 }}
      offset={{ mainAxis: 5, crossAxis: 100 }}
    >
      <ThemeIcon radius={'xl'} size={'xs'}>
        <InformationIcon />
      </ThemeIcon>
    </Tooltip>
  );
}
