import { useTranslation } from 'react-i18next';
import { Box, Group, SegmentedControl } from '@mantine/core';

import { PropertyOwnerChildren } from '@/components/PropertyOwner/PropertyOwnerChildren';
import { useProperty } from '@/hooks/properties';
import { usePropertyOwner, useVisibleProperties } from '@/hooks/propertyOwner';
import { Uri } from '@/types/types';

import { CartesianControls } from './CartesianControls';
import { LocalRotationControls } from './LocalRotationControls';
import { RadiusAzimuthElevationControls } from './RadiusAzimuthElevationControls';

interface Props {
  uri: Uri;
}

export function ScreenSpacePlacementOwner({ uri }: Props) {
  const { t } = useTranslation('panel-screenspacerenderable', {
    keyPrefix: 'placement'
  });

  const propertyOwner = usePropertyOwner(uri);

  if (!propertyOwner) {
    throw Error(`No property owner found for uri: ${uri}`);
  }

  const visibleProperties = useVisibleProperties(propertyOwner);

  const uris = {
    useRae: `${uri}.UseRadiusAzimuthElevation`,
    posCartesian: `${uri}.CartesianPosition`,
    posRae: `${uri}.RadiusAzimuthElevation`,
    localRotation: `${uri}.Rotation`
  };

  const [useRae, setUseRae] = useProperty('BoolProperty', uris.useRae);

  const hideProperties = Object.values(uris);

  const filteredProperties = visibleProperties.filter(
    (property) => !hideProperties.includes(property)
  );

  return (
    <>
      <Box ml={'xs'}>
        <Group wrap={'nowrap'} gap={'xs'} mb={5}>
          <SegmentedControl
            value={useRae ? 'RAE' : 'XYZ'}
            data={[
              { value: 'RAE', label: t('mode-switch.label-rae') },
              { value: 'XYZ', label: t('mode-switch.label-xyz') }
            ]}
            onChange={(value) => setUseRae(value === 'RAE')}
            aria-label={t('mode-switch.aria-label')}
          />
        </Group>
        {useRae ? (
          <RadiusAzimuthElevationControls propertyUri={uris.posRae} />
        ) : (
          <CartesianControls propertyUri={uris.posCartesian} />
        )}
        <LocalRotationControls propertyUri={uris.localRotation} />
      </Box>
      <PropertyOwnerChildren
        properties={filteredProperties}
        subowners={propertyOwner.subowners ?? []}
      />
    </>
  );
}
