import { Button, Group } from '@mantine/core';

import { Tooltip } from '@/components/Tooltip/Tooltip';

interface Props {
  name: string;
  description: string;
  disabled: boolean;
  setPropertyValue: (newValue: null) => void;
}

export function TriggerProperty({
  name,
  description,
  disabled,
  setPropertyValue
}: Props) {
  return (
    <Group>
      <Button onClick={() => setPropertyValue(null)} disabled={disabled}>
        {name}
      </Button>
      <Tooltip text={description} />
    </Group>
  );
}
