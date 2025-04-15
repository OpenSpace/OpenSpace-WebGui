import { Group, InputLabel, Text, Tooltip } from '@mantine/core';

import { InfoBox } from '@/components/InfoBox/InfoBox';
import { useAppSelector } from '@/redux/hooks';

import CopyUriButton from '../CopyUriButton/CopyUriButton';

import { PropertyProps } from './types';

export function PropertyLabel({ uri, readOnly }: PropertyProps) {
  const meta = useAppSelector((state) => state.properties.properties[uri]?.metaData);

  if (!meta) {
    return <></>;
  }

  const { guiName, description } = meta;

  return (
    <Group wrap={'nowrap'}>
      <InputLabel fw={'normal'}>
        <Text span size={'sm'}>
          {guiName}
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
          <CopyUriButton uri={uri} />
        </InfoBox>
      )}
    </Group>
  );
}
