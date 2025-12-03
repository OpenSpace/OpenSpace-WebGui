import { Box, MantineStyleProps } from '@mantine/core';

import { Property } from '@/components/Property/Property';
import { usePropertyOwner, useVisibleProperties } from '@/hooks/propertyOwner';
import { Uri } from '@/types/types';

import { PropertyOwner } from '../../PropertyOwner';

import { VideoPlayer } from './VideoPlayer';

interface Props extends MantineStyleProps {
  uri: Uri;
}

/**
 * A custom component to render a Video Player property owner.
 */
export function VideoPlayerPropertyOwner({ uri, ...styleProps }: Props) {
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
    <Box>
      <VideoPlayer uri={uri} {...styleProps} />
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
    </Box>
  );
}
