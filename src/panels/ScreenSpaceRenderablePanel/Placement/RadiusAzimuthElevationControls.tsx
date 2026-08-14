import { Group, NumberInput, Text } from '@mantine/core';

import { NumericSlider } from '@/components/Input/NumericInput/NumericSlider/NumericSlider';
import { useProperty } from '@/hooks/properties';
import { useIsAdvancedUserLevel } from '@/hooks/userLevel';
import { ArrowsLeftRightIcon, ArrowsUpDownIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';
import { Uri } from '@/types/types';

import { AngleInput } from './AngleInput';
import { PropertyGroupContainer } from './PropertyGroupContainer';

interface Props {
  propertyUri: Uri;
}

export function RadiusAzimuthElevationControls({ propertyUri }: Props) {
  const [value, setValue, meta] = useProperty('Vec3Property', propertyUri);

  const isAdvancedUser = useIsAdvancedUserLevel();

  if (!value || !meta) {
    throw Error(`Missing property with uri: ${propertyUri}`);
  }

  return (
    <PropertyGroupContainer
      uri={propertyUri}
      type={'Vec3Property'}
      name={'Spherical position'}
      description={
        'Screenspace position in spherical coordinates (radius, azimuth, elevation). Radius is an advanced property hidden for lower user levels. It controls the distance to the screenspace plane, allowing objects to be layered at different depths.'
      }
      mt={'xs'}
    >
      <Group gap={'xs'} pt={5} align={'flex-start'}>
        <AngleInput
          value={value[1]}
          onChange={(newValue) => setValue([value[0], Number(newValue), value[2]])}
          disabled={meta.isReadOnly}
          label={
            <Group gap={5} wrap={'nowrap'}>
              <ArrowsLeftRightIcon size={IconSize.xs} />
              <Text size={'sm'}>Azimuth</Text>
            </Group>
          }
        />

        <AngleInput
          value={value[2]}
          onChange={(newValue) => setValue([value[0], value[1], Number(newValue)])}
          disabled={meta.isReadOnly}
          label={
            <Group gap={5} wrap={'nowrap'}>
              <ArrowsUpDownIcon size={IconSize.xs} />
              <Text size={'sm'}>Elevation</Text>
            </Group>
          }
        />
      </Group>
      {isAdvancedUser && (
        <Group gap={'xs'} mt={'xs'} align={'flex-start'}>
          <Text size={'sm'}>Radius</Text>
          <NumberInput
            aria-label={'Radius'}
            value={value[0]}
            size={'xs'}
            maw={80}
            flex={1}
            step={meta.additionalData.step[0]}
            disabled={meta.isReadOnly}
            decimalScale={2}
            onChange={(newValue) => setValue([Number(newValue), value[1], value[2]])}
          />
          <NumericSlider
            flex={1}
            value={value[0]}
            disabled={meta.isReadOnly}
            min={meta.additionalData.min[0]}
            max={meta.additionalData.max[0]}
            step={meta.additionalData.step[0]}
            onInput={(newValue) => setValue([Number(newValue), value[1], value[2]])}
          />
        </Group>
      )}
    </PropertyGroupContainer>
  );
}
