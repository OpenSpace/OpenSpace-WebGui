import { Button, Group } from '@mantine/core';

import CopyUriButton from '@/components/CopyUriButton/CopyUriButton';
import { InfoBox } from '@/components/InfoBox/InfoBox';
import { PropertyProps } from '@/components/Property/types';
import { useProperty } from '@/hooks/properties';

export function TriggerProperty({ uri, readOnly }: PropertyProps) {
  const [, trigger, meta] = useProperty('TriggerProperty', uri);

  if (!meta) {
    return <></>;
  }

  return (
    <Group>
      <Button onClick={() => trigger(null)} disabled={readOnly}>
        {meta.guiName}
      </Button>
      <InfoBox>
        {meta.description}
        <CopyUriButton uri={uri} />
      </InfoBox>
    </Group>
  );
}
