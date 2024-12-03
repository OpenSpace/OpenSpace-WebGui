import { Paper, Space } from '@mantine/core';

import { GlobeLayersPropertyOwner } from '@/panels/Scene/GlobeLayers/GlobeLayersPropertyOwner';
import { useAppSelector } from '@/redux/hooks';
import { displayName, isGlobeLayersUri } from '@/util/propertyTreeHelpers';

import { CollapsableContent } from '../CollapsableContent/CollapsableContent';
import { Property } from '../Property/Property';

import { PropertyOwnerVisibilityCheckbox } from './VisiblityCheckbox';

interface Props {
  uri: string;
  hideSubOwners?: boolean;
  withHeader?: boolean;
  expandedOnDefault?: boolean;
}

export function PropertyOwner({
  uri,
  hideSubOwners = false,
  withHeader = true,
  expandedOnDefault = false
}: Props) {
  const propertyOwner = useAppSelector(
    (state) => state.propertyOwners.propertyOwners[uri]
  );

  const isGlobeLayers = useAppSelector((state) =>
    isGlobeLayersUri(uri, state.properties.properties)
  );

  if (!propertyOwner) {
    return null;
  }

  // TODO: This should also account for properties filtered on visiblity
  const hasContent =
    propertyOwner?.subowners.length > 0 || propertyOwner?.properties.length > 0;

  if (!hasContent) {
    return null;
  }

  // First handle any custom content types, like GlobeLayers
  let content;
  if (isGlobeLayers) {
    content = <GlobeLayersPropertyOwner uri={uri} />;
  } else {
    content = (
      <>
        {!hideSubOwners && propertyOwner.subowners.length > 0 && (
          <>
            {propertyOwner.subowners.map((subowner) => (
              <PropertyOwner key={subowner} uri={subowner} />
            ))}
            {propertyOwner.properties.length > 0 && <Space h={'xs'} />}
          </>
        )}
        {propertyOwner.properties.length > 0 && (
          <Paper p={'xs'}>
            {propertyOwner.properties.map((property) => (
              <Property key={property} uri={property} />
            ))}
          </Paper>
        )}
      </>
    );
  }

  if (!withHeader) {
    return content;
  }

  return (
    <CollapsableContent
      title={displayName(propertyOwner)}
      leftSection={<PropertyOwnerVisibilityCheckbox uri={uri} />}
      defaultOpen={expandedOnDefault}
      noTransition
    >
      {content}
    </CollapsableContent>
  );
}
