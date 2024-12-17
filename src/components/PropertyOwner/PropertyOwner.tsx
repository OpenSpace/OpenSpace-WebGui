import { Group, Paper, Space } from '@mantine/core';

import { useGetPropertyOwner, useGetVisibleProperties } from '@/api/hooks';
import { CollapsableContent } from '@/components/CollapsableContent/CollapsableContent';
import { Property } from '@/components/Property/Property';
import { Tooltip } from '@/components/Tooltip/Tooltip';
import { GlobeLayersPropertyOwner } from '@/panels/Scene/GlobeLayers/GlobeLayersPropertyOwner';
import { useAppSelector } from '@/redux/hooks';
import { displayName, isGlobeLayersUri } from '@/util/propertyTreeHelpers';

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
  const propertyOwner = useGetPropertyOwner(uri);

  if (!propertyOwner) {
    throw Error(`No property owner found for uri: ${uri}`);
  }

  const isGlobeLayers = useAppSelector((state) =>
    isGlobeLayersUri(uri, state.properties.properties)
  );

  const visibleProperties = useGetVisibleProperties(propertyOwner);
  const subowners = propertyOwner.subowners ?? [];
  const hasSubowners = subowners.length > 0;
  const hasVisibleProperties = visibleProperties.length > 0;

  const hasContent = hasSubowners || hasVisibleProperties;

  if (!hasContent) {
    return <></>;
  }

  // First handle any custom content types, like GlobeLayers
  let content;
  if (isGlobeLayers) {
    content = <GlobeLayersPropertyOwner uri={uri} />;
  } else {
    content = (
      <>
        {!hideSubOwners && hasSubowners && (
          <>
            {subowners.map((subowner) => (
              <PropertyOwner key={subowner} uri={subowner} />
            ))}
            {hasVisibleProperties && <Space h={'xs'} />}
          </>
        )}
        {hasVisibleProperties && (
          <Paper p={'xs'}>
            {visibleProperties.map((property) => (
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
      title={
        <Group gap={'xs'}>
          {displayName(propertyOwner)}
          {propertyOwner.description && <Tooltip text={propertyOwner.description} />}
        </Group>
      }
      leftSection={<PropertyOwnerVisibilityCheckbox uri={uri} />}
      defaultOpen={expandedOnDefault}
      noTransition
    >
      {content}
    </CollapsableContent>
  );
}
