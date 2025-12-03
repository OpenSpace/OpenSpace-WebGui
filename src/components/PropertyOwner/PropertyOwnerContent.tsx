import { Box } from '@mantine/core';

import { Property } from '@/components/Property/Property';
import { usePropertyOwner, useVisibleProperties } from '@/hooks/propertyOwner';
import { Uri } from '@/types/types';

import { PropertyOwner } from './PropertyOwner';

interface Props {
  uri: Uri;
  hideSubowners?: boolean;
}

export function PropertyOwnerContent({ uri, hideSubowners = false }: Props) {
  const propertyOwner = usePropertyOwner(uri);

  if (!propertyOwner) {
    throw Error(`No property owner found for uri: ${uri}`);
  }

  const visibleProperties = useVisibleProperties(propertyOwner);
  const subowners = propertyOwner.subowners ?? [];

  return (
    <Box>
      {!hideSubowners && subowners.length > 0 && (
        <Box>
          {subowners.map((subowner) => (
            <PropertyOwner key={subowner} uri={subowner} />
          ))}
        </Box>
      )}
      {visibleProperties.length > 0 && (
        <Box ml={'xs'} mt={'xs'}>
          {visibleProperties.map((property) => (
            <Property key={property} uri={property} />
          ))}
        </Box>
      )}
    </Box>
  );
}
