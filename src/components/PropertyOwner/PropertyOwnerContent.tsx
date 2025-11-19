import { Box } from '@mantine/core';

import { Property } from '@/components/Property/Property';
import { usePropertyOwner, useVisibleProperties } from '@/hooks/propertyOwner';
import { GlobeLayersPropertyOwner } from '@/panels/Scene/GlobeLayers/GlobeLayersPropertyOwner';
import { useAppSelector } from '@/redux/hooks';
import { Uri } from '@/types/types';
import { isGlobeLayersUri } from '@/util/propertyTreeHelpers';

import { PropertyOwner } from './PropertyOwner';
import { VideoPlayer } from './VideoPlayer';

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

  let visibleProperties = useVisibleProperties(propertyOwner);
  const subowners = propertyOwner.subowners ?? [];

  // Separate video player subowner if it exists, so we can render a custom component.
  // Note that we don't want to do this if the current property owner is the TileProvider
  // since in that case the VideoPlayer would be rendered at the GlobeLayer level.
  const videoPlayerUri = uri.endsWith('.TileProvider')
    ? undefined
    : subowners.find((subowner) => subowner.endsWith('.VideoPlayer'));

  // Special handling to hide certain properties from the VideoPlayer property owner,
  // since we render them in a custom way in the VideoPlayerComponent
  if (propertyOwner.identifier === 'VideoPlayer') {
    const PropertiesToHide = ['.Play', '.Pause', '.GoToStart'];
    visibleProperties = visibleProperties.filter(
      (propUri) => !PropertiesToHide.some((s) => propUri.endsWith(s))
    );
  }

  // First handle any custom content types that has a special treatment, like GlobeLayers
  if (isGlobeLayers) {
    return <GlobeLayersPropertyOwner uri={uri} />;
  }

  return (
    <Box>
      {videoPlayerUri && <VideoPlayer uri={videoPlayerUri} mb={'xs'} />}
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
