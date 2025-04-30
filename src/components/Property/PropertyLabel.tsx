import { JSX } from 'react';
import { Text, Tooltip } from '@mantine/core';

import CopyUriButton from '@/components/CopyUriButton/CopyUriButton';
import { Label } from '@/components/Label/Label';
import { Uri } from '@/types/types';

interface Props {
  name: string;
  description: string | JSX.Element;
  uri: Uri;
  readOnly?: boolean;
}

export function PropertyLabel({ name, description, uri, readOnly = false }: Props) {
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
      description={
        <>
          {description}
          {uri && <CopyUriButton uri={uri} />}
        </>
      }
    />
  );
}
