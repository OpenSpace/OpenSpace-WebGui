import { Stack, Text } from '@mantine/core';

import { Property } from '@/components/Property/Property';
import { PropertyOwner } from '@/components/PropertyOwner/PropertyOwner';
import { removeLastWordFromUri } from '@/util/propertyTreeHelpers';

import { SearchItemType } from './util';

interface Props {
  type: SearchItemType;
  uri: string;
}

export function SettingsSearchListItem({ type, uri }: Props) {
  if (type == SearchItemType.PropertyOwner) {
    return <PropertyOwner uri={uri} />;
  }

  const isSubowner = type == SearchItemType.SubPropertyOwner;
  return (
    <Stack gap={0}>
      <Text truncate c={'dimmed'}>
        {removeLastWordFromUri(uri)}
      </Text>
      {isSubowner ? <PropertyOwner uri={uri} /> : <Property uri={uri} />}
    </Stack>
  );
}
