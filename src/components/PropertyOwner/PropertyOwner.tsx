import { Group } from '@mantine/core';

import { useGetPropertyOwner, useHasVisibleChildren } from '@/api/hooks';
import { Collapsable } from '@/components/Collapsable/Collapsable';
import { Tooltip } from '@/components/Tooltip/Tooltip';
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
  const propertyOwner = useGetPropertyOwner(uri);

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
          {propertyOwner.description && <Tooltip text={propertyOwner.description} />}
        </Group>
      }
      leftSection={<PropertyOwnerVisibilityCheckbox uri={uri} />}
      defaultOpen={expandedOnDefault}
      noTransition
    >
      <PropertyOwnerContent uri={uri} />
    </Collapsable>
  );
}
