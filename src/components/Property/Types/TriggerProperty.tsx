import { Button, Group } from '@mantine/core';

import { useGetPropertyDescription, useTriggerProperty } from '@/api/hooks';
import { InfoBox } from '@/components/InfoBox/InfoBox';

import { PropertyProps } from '@/components/Property/types';

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
