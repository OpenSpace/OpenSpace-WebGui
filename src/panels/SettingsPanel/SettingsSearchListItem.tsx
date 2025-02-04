import { Stack, Text } from '@mantine/core';
import { useInViewport } from '@mantine/hooks';

import { LoadingBlocks } from '@/components/LoadingBlocks/LoadingBlocks';
import { Property } from '@/components/Property/Property';
import { PropertyOwner } from '@/components/PropertyOwner/PropertyOwner';
import { removeLastWordFromUri } from '@/util/propertyTreeHelpers';

import { SearchItemType } from './util';

interface Props {
  type: SearchItemType;
  uri: string;
}

export function SettingsSearchListItem({ type, uri }: Props) {
  const { ref, inViewport } = useInViewport();

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
          <div ref={ref}>
            {/* Do not render the properties until they are visible in the viewport, since
                they have quite a bad performance */}
            {inViewport ? <Property key={uri} uri={uri} /> : <LoadingBlocks n={1} />}
          </div>
        </Stack>
      );
    default:
      throw Error(`Unknown search item type: ${type}`);
  }
}
