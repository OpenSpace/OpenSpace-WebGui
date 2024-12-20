import { Group, Paper, Text } from '@mantine/core';

import { useGetBoolPropertyValue, useGetPropertyOwner } from '@/api/hooks';
import { CollapsableContent } from '@/components/Collapse/CollapsableContent/CollapsableContent';
import { PropertyOwner } from '@/components/PropertyOwner/PropertyOwner';
import { PropertyOwnerVisibilityCheckbox } from '@/components/PropertyOwner/VisiblityCheckbox';
import { Tooltip } from '@/components/Tooltip/Tooltip';
import { Uri } from '@/types/types';
import { displayName } from '@/util/propertyTreeHelpers';

interface Props {
  uri: Uri;
}

export function GlobeLayer({ uri }: Props) {
  const propertyOwner = useGetPropertyOwner(uri);

  if (!propertyOwner) {
    throw Error(`No property owner found for uri: ${uri}`);
  }

  const [isEnabled] = useGetBoolPropertyValue(`${uri}.Enabled`);

  // @TODO (emmbr, 2024-12-06): We want to avoid hardcoded colors, but since changing the
  // color of the text is a feature we wanted to keep I decided to do it this way for now.
  const textColor = isEnabled ? 'white' : 'dimmed';

  return (
    <CollapsableContent
      title={<Text c={textColor}>{displayName(propertyOwner)}</Text>}
      leftSection={<PropertyOwnerVisibilityCheckbox uri={uri} />}
      rightSection={
        <Group wrap={'nowrap'}>
          <Tooltip text={propertyOwner.description || 'No information'} />
        </Group>
      }
      noTransition
    >
      <Paper withBorder>
        <PropertyOwner uri={uri} withHeader={false} />
      </Paper>
    </CollapsableContent>
  );
}
