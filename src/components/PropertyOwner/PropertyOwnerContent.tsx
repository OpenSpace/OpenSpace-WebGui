import { Box } from '@mantine/core';

import { Property } from '@/components/Property/Property';
import { usePropertyOwner, useGetVisibleProperties } from '@/hooks/propertyOwner';
import { GlobeLayersPropertyOwner } from '@/panels/Scene/GlobeLayers/GlobeLayersPropertyOwner';
import { useAppSelector } from '@/redux/hooks';
import { Uri } from '@/types/types';
import { isGlobeLayersUri } from '@/util/propertyTreeHelpers';

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

  const isGlobeLayers = useAppSelector((state) =>
    isGlobeLayersUri(uri, state.properties.properties)
  );

  const visibleProperties = useGetVisibleProperties(propertyOwner);
  const subowners = propertyOwner.subowners ?? [];

  // First handle any custom content types that has a special treatment, like GlobeLayers
  if (isGlobeLayers) {
    return <GlobeLayersPropertyOwner uri={uri} />;
  }

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
