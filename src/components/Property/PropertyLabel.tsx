import { Group, InputLabel, Text, Tooltip } from '@mantine/core';

import { useGetPropertyDescription } from '@/api/hooks';
import { InfoBox } from '@/components/InfoBox/InfoBox';

import { PropertyProps } from './types';

export function PropertyLabel({ uri, readOnly }: PropertyProps) {
  const description = useGetPropertyDescription(uri);

  if (!description) {
    return <></>;
  }

  const { name, description: tip } = description;

  return (
    <Group wrap={'nowrap'}>
      <InputLabel fw={'normal'}>
        <Text span size={'sm'}>
          {name}
        </Text>
        {readOnly && (
          <Tooltip
            maw={200}
            multiline
            label={`This property is read-only, meaning that it's not intended to be changed.`}
          >
            <Text span ml={'xs'} size={'xs'} c={'dimmed'}>
              (Read-only)
            </Text>
          </Tooltip>
        )}
      </InputLabel>
      {tip && <InfoBox text={tip} />}
    </Group>
  );
}
