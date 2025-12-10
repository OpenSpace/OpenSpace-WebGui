import { PropertyOwnerChildren } from '@/components/PropertyOwner/PropertyOwnerChildren';
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
      <PropertyOwnerChildren properties={visibleProperties} subowners={subowners} />
    </PropertyOwnerCollapsable>
  );
}
