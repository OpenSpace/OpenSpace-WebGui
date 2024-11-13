import { Group, InputLabel } from '@mantine/core';

import { Tooltip } from '@/components/Tooltip/Tooltip';

interface Props {
  label: string;
  tip?: string;
}

export function PropertyLabel({ label, tip }: Props) {
  return (
    <Group>
      <InputLabel>{label}</InputLabel>
      {tip && <Tooltip text={tip} />}
    </Group>
  );
}
