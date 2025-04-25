import { JSX } from 'react';
import { Group, InputLabel, Text, Tooltip } from '@mantine/core';

import { InfoBox } from '@/components/InfoBox/InfoBox';
import { Uri } from '@/types/types';

import CopyUriButton from '../CopyUriButton/CopyUriButton';

interface Props {
  name: string;
  description: string | JSX.Element;
  uri?: Uri;
  readOnly?: boolean;
}

export function Label({ name, description, uri, readOnly = false }: Props) {
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
      {description && (
        <InfoBox>
          {description}
          {uri && <CopyUriButton uri={uri} />}
        </InfoBox>
      )}
    </Group>
  );
}
