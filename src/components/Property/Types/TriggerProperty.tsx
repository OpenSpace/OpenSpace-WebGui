import { Button, Group } from '@mantine/core';

import { InfoBox } from '@/components/InfoBox/InfoBox';

import { ConcretePropertyBaseProps } from '../types';

interface Props extends ConcretePropertyBaseProps {
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
      <InfoBox text={description} />
    </Group>
  );
}
