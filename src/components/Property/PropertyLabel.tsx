import { Group, InputLabel, Text, Tooltip } from '@mantine/core';

import { InfoBox } from '@/components/InfoBox/InfoBox';

interface Props {
  label: string;
  tip?: string;
  isReadOnly: boolean;
}

export function PropertyLabel({ label, tip, isReadOnly }: Props) {
  return (
    <Group wrap={'nowrap'}>
      <InputLabel fw={'normal'}>
        <Text span size={'sm'}>
          {label}
        </Text>
        {isReadOnly && (
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
