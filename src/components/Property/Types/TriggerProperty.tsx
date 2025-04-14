import { Button, Group } from '@mantine/core';

import CopyUriButton from '@/components/CopyUriButton/CopyUriButton';
import { InfoBox } from '@/components/InfoBox/InfoBox';
import { PropertyProps } from '@/components/Property/types';
import { usePropertyDescription, useTriggerProperty } from '@/hooks/properties';

export function TriggerProperty({ uri, readOnly }: PropertyProps) {
  const triggerFunction = useTriggerProperty(uri);
  const description = usePropertyDescription(uri);

  if (!description) {
    return <></>;
  }

  return (
    <Group>
      <Button onClick={triggerFunction} disabled={readOnly}>
        {description.guiName}
      </Button>
      <InfoBox>
        {description.description}
        <CopyUriButton uri={uri} />
      </InfoBox>
    </Group>
  );
}
