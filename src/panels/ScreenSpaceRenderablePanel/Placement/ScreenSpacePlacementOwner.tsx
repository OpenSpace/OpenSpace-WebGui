import { PropertyOwnerChildren } from '@/components/PropertyOwner/PropertyOwnerChildren';
import { useProperty } from '@/hooks/properties';
import { usePropertyOwner, useVisibleProperties } from '@/hooks/propertyOwner';
import { Uri } from '@/types/types';

interface Props {
  uri: Uri;
}

export function ScreenSpacePlacementOwner({ uri }: Props) {
  const propertyOwner = usePropertyOwner(uri);

  if (!propertyOwner) {
    throw Error(`No property owner found for uri: ${uri}`);
  }

  const visibleProperties = useVisibleProperties(propertyOwner);

  const useRaeUri = `${uri}.UseRadiusAzimuthElevation`;
  const [useRaeValue, setUseRae, useRaeMeta] = useProperty('BoolProperty', useRaeUri);

  const hideProperties = [useRaeUri];

  const filteredProperties = visibleProperties.filter(
    (property) => !hideProperties.includes(property)
  );

  return (
    <PropertyOwnerChildren
      properties={filteredProperties}
      subowners={propertyOwner.subowners ?? []}
    />
  );
}
