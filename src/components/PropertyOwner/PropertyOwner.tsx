import { useHasVisibleChildren, usePropertyOwner } from '@/hooks/propertyOwner';
import { useAppSelector } from '@/redux/hooks';
import { Uri } from '@/types/types';
import { displayName, isGlobeLayersUri } from '@/util/propertyTreeHelpers';

import { GlobeLayersPropertyOwner } from './Custom/GlobeLayers/GlobeLayersPropertyOwner';
import { VideoPlayerPropertyOwner } from './Custom/VideoPlayer/VideoPlayerPropertyOwner';
import { PropertyOwnerCollapsable } from './PropertyOwnerCollapsable';
import { PropertyOwnerContent } from './PropertyOwnerContent';

interface Props {
  uri: Uri;
  expandedOnDefault?: boolean;
  onlyContent?: boolean;
  hideSubowners?: boolean;
}

export function PropertyOwner({
  uri,
  expandedOnDefault = false,
  onlyContent = false,
  hideSubowners = false
}: Props) {
  const propertyOwner = usePropertyOwner(uri);

  if (!propertyOwner) {
    throw Error(`No property owner found for uri: ${uri}`);
  }

  const isGlobeLayers = useAppSelector((state) =>
    isGlobeLayersUri(uri, state.properties.properties)
  );

  const hasVisibleChildren = useHasVisibleChildren(uri);

  // If there is no content to show for the current visibility settings, we don't want to
  // render this property owner
  if (!hasVisibleChildren) {
    return <></>;
  }

  // First handle any custom content types that has a special treatment, like GlobeLayers
  if (isGlobeLayers) {
    return <GlobeLayersPropertyOwner uri={uri} />;
  } else if (propertyOwner.identifier === 'VideoPlayer') {
    return <VideoPlayerPropertyOwner uri={uri} expandedOnDefault={true} />;
  }

  // @TODO (2025-12-03, emmbr) Until we have a better structure for tile providers and
  // layers, expand tile poviders per default (to show layer type specific properties)
  if (propertyOwner.identifier === 'TileProvider') {
    expandedOnDefault = true;
  }

  if (onlyContent) {
    return <PropertyOwnerContent uri={uri} hideSubowners={hideSubowners} />;
  }

  return (
    <PropertyOwnerCollapsable
      uri={uri}
      title={displayName(propertyOwner)}
      expandedOnDefault={expandedOnDefault}
    >
      <PropertyOwnerContent uri={uri} hideSubowners={hideSubowners} />
    </PropertyOwnerCollapsable>
  );
}
