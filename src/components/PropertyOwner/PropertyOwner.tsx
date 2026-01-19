import {
  useHasVisibleChildren,
  usePropertyOwner,
  useVisibleProperties
} from '@/hooks/propertyOwner';
import { useAppSelector } from '@/redux/hooks';
import { propertySelectors } from '@/redux/propertyTreeTest/propertySlice';
import { Uri } from '@/types/types';
import { displayName } from '@/util/propertyTreeHelpers';
import { isGlobeLayersUri, isUriRenderableGlobe, parentTypeUri } from '@/util/uris';

import { GlobeLayersPropertyOwner } from './Custom/GlobeLayers/GlobeLayersPropertyOwner';
import { VideoPlayerPropertyOwner } from './Custom/VideoPlayer/VideoPlayerPropertyOwner';
import { PropertyOwnerChildren } from './PropertyOwnerChildren';
import { PropertyOwnerCollapsable } from './PropertyOwnerCollapsable';

interface Props {
  uri: Uri;
  expandedOnDefault?: boolean;
  showOnlyChildren?: boolean;
  hideSubowners?: boolean;
}

export function PropertyOwner({
  uri,
  expandedOnDefault = false,
  showOnlyChildren = false,
  hideSubowners = false
}: Props) {
  const propertyOwner = usePropertyOwner(uri);

  if (!propertyOwner) {
    throw Error(`No property owner found for uri: ${uri}`);
  }

  const isGlobeLayers = useAppSelector((state) => {
    const parent = propertySelectors.selectById(state, parentTypeUri(uri));

    const parentIsGlobe =
      parent?.value !== undefined ? isUriRenderableGlobe(parent.value as string) : false;
    return isGlobeLayersUri(uri) && parentIsGlobe;
  });

  const hasVisibleChildren = useHasVisibleChildren(uri);
  const visibleProperties = useVisibleProperties(propertyOwner);
  const subowners = hideSubowners ? [] : (propertyOwner.subowners ?? []);

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

  if (showOnlyChildren) {
    return <PropertyOwnerChildren properties={visibleProperties} subowners={subowners} />;
  }

  return (
    <PropertyOwnerCollapsable
      uri={uri}
      title={displayName(propertyOwner)}
      expandedOnDefault={expandedOnDefault}
    >
      <PropertyOwnerChildren properties={visibleProperties} subowners={subowners} />
    </PropertyOwnerCollapsable>
  );
}
