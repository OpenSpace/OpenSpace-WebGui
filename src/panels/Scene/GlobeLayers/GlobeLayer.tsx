import { useState } from 'react';
import { Group, Paper, Text } from '@mantine/core';

import { useGetBoolPropertyValue, useGetPropertyOwner } from '@/api/hooks';
import { CollapsableContent } from '@/components/Collapse/CollapsableContent/CollapsableContent';
import { PropertyOwnerContent } from '@/components/PropertyOwner/PropertyOwnerContent';
import { PropertyOwnerVisibilityCheckbox } from '@/components/PropertyOwner/VisiblityCheckbox';
import { Tooltip } from '@/components/Tooltip/Tooltip';
import { Uri } from '@/types/types';
import { displayName } from '@/util/propertyTreeHelpers';

interface Props {
  uri: Uri;
}

export function GlobeLayer({ uri }: Props) {
  const [isEnabled] = useGetBoolPropertyValue(`${uri}.Enabled`);
  const propertyOwner = useGetPropertyOwner(uri);

  const [isActive, setIsActive] = useState(isEnabled);

  if (!propertyOwner) {
    throw Error(`No property owner found for uri: ${uri}`);
  }

  // @TODO (emmbr, 2024-12-06): We want to avoid hardcoded colors, but since changing the
  // color of the text is a feature we wanted to keep I decided to do it this way for now.
  const textColor = isActive ? 'green' : undefined;

  return (
    <CollapsableContent
      title={<Text c={textColor}>{displayName(propertyOwner)}</Text>}
      leftSection={
        <PropertyOwnerVisibilityCheckbox
          uri={uri}
          onChange={(isChecked) => setIsActive(isChecked)}
        />
      }
      rightSection={
        <Group wrap={'nowrap'}>
          <Tooltip text={propertyOwner.description || 'No information'} />
        </Group>
      }
      noTransition
    >
      <Paper withBorder>
        <PropertyOwnerContent uri={uri} />
      </Paper>
    </CollapsableContent>
  );
}
