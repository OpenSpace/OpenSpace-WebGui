import { Text, Tooltip } from '@mantine/core';

import { Label } from '@/components/Label/Label';
import { Uri } from '@/types/types';

import { PropertyDescription } from './PropertyDescription';

interface Props {
  name: string;
  uri: Uri;
  description?: string;
  readOnly?: boolean;
}

export function PropertyLabel({ name, uri, description, readOnly = false }: Props) {
  return (
    <Label
      name={
        <>
          {name}
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
        </>
      }
      info={
        description ? (
          <PropertyDescription uri={uri} description={description} />
        ) : undefined
      }
    />
  );
}
