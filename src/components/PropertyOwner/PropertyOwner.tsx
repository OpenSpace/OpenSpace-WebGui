import { Group, Paper, Space } from '@mantine/core';
import { shallowEqual } from '@mantine/hooks';

import { useGetOptionPropertyValue, useSubscribeToProperty } from '@/api/hooks';
import { GlobeLayersPropertyOwner } from '@/panels/Scene/GlobeLayers/GlobeLayersPropertyOwner';
import { useAppSelector } from '@/redux/hooks';
import { EnginePropertyVisibilityKey } from '@/util/keys';
import {
  displayName,
  isGlobeLayersUri,
  isPropertyVisible
} from '@/util/propertyTreeHelpers';

import { CollapsableContent } from '../CollapsableContent/CollapsableContent';
import { Property } from '../Property/Property';
import { Tooltip } from '../Tooltip/Tooltip';

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

  const visiblityLevelSetting = useGetOptionPropertyValue(EnginePropertyVisibilityKey);
  useSubscribeToProperty(EnginePropertyVisibilityKey);

  // @TODO (emmbr, 2024-12-03) Would be nice if we didn't have to use a selector for this.
  // The reason we do is that the state.properties.properties object includes the property
  // values, and hence updates on every property change. One idea would be to seprate the
  // property values from the property descriptions in the redux store.
  const visibleProperties =
    useAppSelector(
      (state) =>
        propertyOwner?.properties.filter((p) =>
          isPropertyVisible(
            state.properties.properties[p]?.description,
            visiblityLevelSetting
          )
        ),
      shallowEqual
    ) || [];

  if (!propertyOwner) {
    return null;
  }

  const subowners = propertyOwner?.subowners ?? [];
  const hasSubowners = subowners.length > 0;
  const hasVisibleProperties = visibleProperties.length > 0;

  const hasContent = hasSubowners || hasVisibleProperties;

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
