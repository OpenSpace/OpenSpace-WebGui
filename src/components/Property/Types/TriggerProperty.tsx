import { Button, Group } from '@mantine/core';

import CopyUriButton from '@/components/CopyUriButton/CopyUriButton';
import { InfoBox } from '@/components/InfoBox/InfoBox';
import { PropertyProps } from '@/components/Property/types';
import { useProperty } from '@/types/hooks';

export function TriggerProperty({ uri, readOnly }: PropertyProps) {
  const [_, trigger, meta] = useProperty('TriggerProperty', uri);

  if (!meta) {
    return <></>;
  }

  return (
    <Group>
      <Button onClick={() => trigger()} disabled={readOnly}>
        {meta.guiName}
      </Button>
      <InfoBox>
        {meta.description}
        <CopyUriButton uri={uri} />
      </InfoBox>
    </Group>
  );
}
