import { Group, InputLabel } from '@mantine/core';

import { InfoBox } from '@/components/InfoBox/InfoBox';

interface Props {
  label: string;
  tip?: string;
}

export function PropertyLabel({ label, tip }: Props) {
  return (
    <Group wrap={'nowrap'}>
      <InputLabel>{label}</InputLabel>
      {tip && <InfoBox text={tip} />}
    </Group>
  );
}
