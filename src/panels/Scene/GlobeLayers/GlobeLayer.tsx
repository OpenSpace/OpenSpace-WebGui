import { Group, Text } from '@mantine/core';

import { Collapsable } from '@/components/Collapsable/Collapsable';
import { InfoBox } from '@/components/InfoBox/InfoBox';
import { PropertyOwnerContent } from '@/components/PropertyOwner/PropertyOwnerContent';
import { PropertyOwnerVisibilityCheckbox } from '@/components/PropertyOwner/VisiblityCheckbox';
import { usePropertyOwner, usePropertyOwnerVisibility } from '@/hooks/propertyOwner';
import { Uri } from '@/types/types';
import { displayName } from '@/util/propertyTreeHelpers';

interface Props {
  uri: Uri;
}

export function GlobeLayer({ uri }: Props) {
  const propertyOwner = usePropertyOwner(uri);

  const { isVisible } = usePropertyOwnerVisibility(uri);

  if (!propertyOwner) {
    throw Error(`No property owner found for uri: ${uri}`);
  }

  // @TODO (emmbr, 2024-12-06): We want to avoid hardcoded colors, but since changing the
  // color of the text is a feature we wanted to keep I decided to do it this way for now.
  const textColor = isVisible ? 'green' : undefined;

  return (
    <Collapsable
      title={<Text c={textColor}>{displayName(propertyOwner)}</Text>}
      leftSection={<PropertyOwnerVisibilityCheckbox uri={uri} />}
      rightSection={
        <Group wrap={'nowrap'}>
          <InfoBox text={propertyOwner.description || 'No information'} uri={uri} />
        </Group>
      }
      noTransition
    >
      <PropertyOwnerContent uri={uri} />
    </Collapsable>
  );
}
