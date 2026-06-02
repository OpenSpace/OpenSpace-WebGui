import { useTranslation } from 'react-i18next';
import { Group, Text } from '@mantine/core';

import { Collapsable } from '@/components/Collapsable/Collapsable';
import CopyUriButton from '@/components/CopyUriButton/CopyUriButton';
import { InfoBox } from '@/components/InfoBox/InfoBox';
import { PropertyOwnerChildren } from '@/components/PropertyOwner/PropertyOwnerChildren';
import { PropertyOwnerVisibilityCheckbox } from '@/components/PropertyOwner/VisiblityCheckbox';
import {
  usePropertyOwner,
  usePropertyOwnerVisibility,
  useVisibleProperties
} from '@/hooks/propertyOwner';
import { Uri } from '@/types/types';
import { displayName } from '@/util/propertyTreeHelpers';

interface Props {
  uri: Uri;
}

export function GlobeLayer({ uri }: Props) {
  const { t } = useTranslation('panel-scene', { keyPrefix: 'globe-layer' });

  const propertyOwner = usePropertyOwner(uri);
  const { visibility, setVisibility } = usePropertyOwnerVisibility(uri);
  const visibleProperties = useVisibleProperties(propertyOwner);
  const subowners = propertyOwner?.subowners ?? [];

  // Return null instead of throwing: when a layer is removed, the layers list may still
  // contain this URI for one render cycle before the property tree is updated. On the
  // next render the URI will be gone and this component won't be mounted at all.
  if (!propertyOwner) {
    throw Error(`${t('error.no-property-owner-for-uri')}: ${uri}`);
  }

  // @TODO (emmbr, 2024-12-06): We want to avoid hardcoded colors, but since changing the
  // color of the text is a feature we wanted to keep I decided to do it this way for now.
  const textColor = visibility === 'Visible' ? 'green' : undefined;

  return (
    <Collapsable
      title={<Text c={textColor}>{displayName(propertyOwner)}</Text>}
      leftSection={
        <PropertyOwnerVisibilityCheckbox
          uri={uri}
          visibility={visibility}
          setVisibility={setVisibility}
        />
      }
      rightSection={
        <Group wrap={'nowrap'}>
          <InfoBox>
            {propertyOwner.description || t('no-information')}
            <CopyUriButton uri={uri} />
          </InfoBox>
        </Group>
      }
      noTransition
    >
      <PropertyOwnerChildren properties={visibleProperties} subowners={subowners} />
    </Collapsable>
  );
}
