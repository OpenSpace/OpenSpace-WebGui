import { useTranslation } from 'react-i18next';
import { Group, Text } from '@mantine/core';

import { Collapsable } from '@/components/Collapsable/Collapsable';
import CopyUriButton from '@/components/CopyUriButton/CopyUriButton';
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
  const { t } = useTranslation('panel-scene', { keyPrefix: 'globe-layers' });

  if (!propertyOwner) {
    throw Error(t('error.no-property-owner', { uri }));
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
          <InfoBox>
            {propertyOwner.description || t('no-description')}
            <CopyUriButton uri={uri} />
          </InfoBox>
        </Group>
      }
      noTransition
    >
      <PropertyOwnerContent uri={uri} />
    </Collapsable>
  );
}
