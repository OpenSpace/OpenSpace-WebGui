import { ThemeIcon, Tooltip } from '@mantine/core';

import { InformationIcon } from '@/icons/icons';

interface Props {
  text: React.ReactNode;
  w?: number;
}

export function InfoBox({ text, w = 220 }: Props) {
  return (
    <Tooltip
      label={text}
      multiline
      w={w}
      offset={{ mainAxis: 5, crossAxis: 100 }}
      events={{ hover: true, focus: true, touch: true }}
    >
      <ThemeIcon tabIndex={0} radius={'xl'} size={'xs'}>
        <InformationIcon />
      </ThemeIcon>
    </Tooltip>
  );
}
