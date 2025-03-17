import { Button, Group } from '@mantine/core';

import { InfoBox } from '@/components/InfoBox/InfoBox';

import { PropertyProps } from '../types';
import { useGetPropertyDescription, useTriggerProperty } from '@/api/hooks';

export function TriggerProperty({ uri }: PropertyProps) {
  const triggerFunc = useTriggerProperty(uri);
  const description = useGetPropertyDescription(uri);

  if (!description) {
    return <></>;
  }

  return (
    <Group>
      <Button onClick={triggerFunc} disabled={description.metaData.isReadOnly}>
        {description.name}
      </Button>
      <InfoBox text={description.description} />
    </Group>
  );
}
