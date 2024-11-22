import React from 'react';
import { Collapse, Paper } from '@mantine/core';
import { shallowEqual, useDisclosure } from '@mantine/hooks';

import { CollapsableHeader } from '@/components/CollapsableHeader/CollapsableHeader';
import { Property } from '@/components/Property/Property';
import { useAppSelector } from '@/redux/hooks';
import { isPropertyVisible, isRenderable } from '@/util/propertytreehelper';

interface Props {
  uri: string;
  autoExpand?: boolean;
}

export const PropertyOwner = React.memo(({ uri, autoExpand }: Props) => {
  const [expanded, { toggle }] = useDisclosure(autoExpand || false);

  const propertyOwners = useAppSelector((state) => state.propertyOwners.propertyOwners);
  const propertyOwner = useAppSelector(
    (state) => state.propertyOwners.propertyOwners[uri]
  );
  const properties = useAppSelector((state) => {
    const subProperties = propertyOwner?.properties || [];
    return subProperties.filter((prop) =>
      isPropertyVisible(state.properties.properties, prop)
    );
  }, shallowEqual);

  const subPropertyOwners = propertyOwner?.subowners || [];
  const name = propertyOwner?.name;

  const hasChildren = properties.length > 0 || subPropertyOwners.length > 0;
  if (propertyOwner === undefined || !hasChildren) {
    return;
  }

  const sortedSubOwners = subPropertyOwners.slice().sort((uriA, uriB) => {
    const a = propertyOwners[uriA]?.name || '';
    const b = propertyOwners[uriB]?.name || '';
    return a.localeCompare(b);
  });

  return (
    <Paper withBorder p={'1px'} onClick={(event) => event.stopPropagation()}>
      {/* TODO: The rendering of these components are very slow...
            Setting the transition duration to zero helps a bit, but still*/}
      <CollapsableHeader expanded={expanded} toggle={toggle} text={name} />
      {/* TODO: These componetns looked awful without the added margin and padding (ml and p).
          But we should remove the styling once we've decided how to do for the entire page*/}
      <Collapse in={expanded} ml={'lg'} transitionDuration={0}>
        {sortedSubOwners.map((uri) => (
          <PropertyOwner key={uri} uri={uri} autoExpand={isRenderable(uri)} />
        ))}
        {properties.map((uri) => (
          <Property key={uri} uri={uri} />
        ))}
      </Collapse>
    </Paper>
  );
})

