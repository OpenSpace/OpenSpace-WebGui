import { Fieldset } from '@mantine/core';

import { useAppSelector } from '@/redux/hooks';

import { CollapsableContent } from '../CollapsableContent/CollapsableContent';
import { Property } from '../Property/Property';

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

  if (!propertyOwner) {
    return null;
  }

  // TODO: This should also account for properties filtered on visiblity
  const hasContent =
    propertyOwner.subowners.length > 0 || propertyOwner.properties.length > 0;

  if (!hasContent) {
    return null;
  }

  const content = (
    <>
      {!hideSubOwners &&
        propertyOwner.subowners.map((subowner) => (
          <PropertyOwner key={subowner} uri={subowner} />
        ))}
      {propertyOwner.properties.length > 0 && (
        <Fieldset p={'xs'}>
          {propertyOwner.properties.map((property) => (
            <Property key={property} uri={property} />
          ))}
        </Fieldset>
      )}
    </>
  );

  if (!withHeader) {
    return content;
  }

  return (
    <CollapsableContent
      title={propertyOwner.name ?? propertyOwner.identifier ?? uri}
      defaultOpen={expandedOnDefault}
      noTransition
    >
      {content}
    </CollapsableContent>
  );
}
