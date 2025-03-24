import { Box, Group } from '@mantine/core';

import { Collapsable } from '@/components/Collapsable/Collapsable';
import { InfoBox } from '@/components/InfoBox/InfoBox';
import { useHasVisibleChildren, usePropertyOwner } from '@/hooks/propertyOwner';
import { Uri } from '@/types/types';
import { displayName } from '@/util/propertyTreeHelpers';

import { PropertyOwnerContent } from './PropertyOwnerContent';
import { PropertyOwnerVisibilityCheckbox } from './VisiblityCheckbox';

interface Props {
  uri: Uri;
  expandedOnDefault?: boolean;
  withHeader?: boolean;
}

export function PropertyOwner({ uri, expandedOnDefault = false }: Props) {
  const propertyOwner = usePropertyOwner(uri);

  if (!propertyOwner) {
    throw Error(`No property owner found for uri: ${uri}`);
  }

  const hasVisibleChildren = useHasVisibleChildren(uri);

  // If there is no content to show for the current visibility settings, we don't want to
  // render this property owner
  if (!hasVisibleChildren) {
    return <></>;
  }

  return (
    <Collapsable
      title={
        <Group gap={'xs'}>
          {displayName(propertyOwner)}
          {propertyOwner.description && <InfoBox text={propertyOwner.description} />}
        </Group>
      }
      leftSection={<PropertyOwnerVisibilityCheckbox uri={uri} />}
      defaultOpen={expandedOnDefault}
      noTransition
    >
      <Box style={{ borderLeft: '2px solid var(--mantine-color-gray-8)' }}>
        <PropertyOwnerContent uri={uri} />
      </Box>
    </Collapsable>
  );
}
