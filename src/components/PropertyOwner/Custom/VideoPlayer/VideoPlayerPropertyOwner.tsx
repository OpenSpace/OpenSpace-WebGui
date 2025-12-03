import { Box } from '@mantine/core';

import { Property } from '@/components/Property/Property';
import { PropertyOwner } from '@/components/PropertyOwner/PropertyOwner';
import { PropertyOwnerCollapsable } from '@/components/PropertyOwner/PropertyOwnerCollapsable';
import { usePropertyOwner, useVisibleProperties } from '@/hooks/propertyOwner';
import { Uri } from '@/types/types';
import { displayName } from '@/util/propertyTreeHelpers';

import { VideoPlayer } from './VideoPlayer';

interface Props {
  uri: Uri;
  expandedOnDefault?: boolean;
}

/**
 * A custom component to render a Video Player property owner.
 */
export function VideoPlayerPropertyOwner({ uri, expandedOnDefault = false }: Props) {
  const propertyOwner = usePropertyOwner(uri);

  if (!propertyOwner) {
    throw Error(`No property owner found for uri: ${uri}`);
  }

  const PropertiesToHide = ['.Play', '.Pause', '.GoToStart', '.LoopVideo', '.PlayAudio'];

  const visibleProperties = useVisibleProperties(propertyOwner).filter(
    (propUri) => !PropertiesToHide.some((s) => propUri.endsWith(s))
  );
  const subowners = propertyOwner.subowners ?? [];

  return (
    <PropertyOwnerCollapsable
      uri={uri}
      title={displayName(propertyOwner)}
      expandedOnDefault={expandedOnDefault}
    >
      <VideoPlayer uri={uri} />
      {subowners.length > 0 && (
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
    </PropertyOwnerCollapsable>
  );
}
