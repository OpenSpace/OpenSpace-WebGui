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
  switch (type) {
    case SearchItemType.PropertyOwner:
      return <PropertyOwner uri={uri} />;
    case SearchItemType.SubPropertyOwner:
      return (
        <Stack gap={0}>
          <Text truncate c={'dimmed'}>
            {removeLastWordFromUri(uri)}
          </Text>
          <PropertyOwner uri={uri} />
        </Stack>
      );
    case SearchItemType.Property:
      return (
        <Stack gap={0}>
          <Text truncate c={'dimmed'}>
            {removeLastWordFromUri(uri)}
          </Text>
          <Property key={uri} uri={uri} />
        </Stack>
      );
    default:
      // This should not happen. @TODO: Throw?
      return <></>;
  }
}
