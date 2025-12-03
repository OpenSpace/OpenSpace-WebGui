import { Box } from '@mantine/core';

import { Property } from '@/components/Property/Property';
import { GlobeLayersPropertyOwner } from '@/components/PropertyOwner/Custom/GlobeLayers/GlobeLayersPropertyOwner';
import { usePropertyOwner, useVisibleProperties } from '@/hooks/propertyOwner';
import { useAppSelector } from '@/redux/hooks';
import { Uri } from '@/types/types';
import { isGlobeLayersUri } from '@/util/propertyTreeHelpers';

import { VideoPlayerPropertyOwner } from './Custom/VideoPlayer/VideoPlayerPropertyOwner';
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

  const visibleProperties = useVisibleProperties(propertyOwner);
  const subowners = propertyOwner.subowners ?? [];

  // TODO: Move to propertyOwner instead of content
  // First handle any custom content types that has a special treatment, like GlobeLayers
  if (isGlobeLayers) {
    return <GlobeLayersPropertyOwner uri={uri} />;
  } else if (propertyOwner.identifier === 'VideoPlayer') {
    return <VideoPlayerPropertyOwner uri={uri} />;
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
