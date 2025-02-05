import { Container } from '@mantine/core';

import { useGetPropertyOwner, useGetVisibleProperties } from '@/api/hooks';
import { Property } from '@/components/Property/Property';
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
  const propertyOwner = useGetPropertyOwner(uri);

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
    <>
      {!hideSubowners && (
        <>
          {subowners.map((subowner) => (
            <PropertyOwner key={subowner} uri={subowner} />
          ))}
        </>
      )}
      {visibleProperties.length > 0 && (
        <>
          {visibleProperties.map((property) => (
            <Property key={property} uri={property} />
          ))}
        </>
      )}
    </>
  );
}
