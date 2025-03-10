import { ThemeIcon, Tooltip } from '@mantine/core';

import { InformationIcon } from '@/icons/icons';

interface Props {
  text: React.ReactNode;
  w?: number;
}

export function InfoBox({ text, w = 220 }: Props) {
  return (
    <Tooltip label={text} multiline maw={w} offset={{ mainAxis: 5, crossAxis: 100 }}>
      <ThemeIcon radius={'xl'} size={'xs'}>
        <InformationIcon />
      </ThemeIcon>
    </Tooltip>
  );
}
