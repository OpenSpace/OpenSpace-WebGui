import { Fieldset, Group, NumberInput, Text } from '@mantine/core';

import { NumericSlider } from '@/components/Input/NumericInput/NumericSlider/NumericSlider';
import { PropertyLabel } from '@/components/Property/PropertyLabel';
import { useProperty } from '@/hooks/properties';
import { ArrowsLeftRightIcon, ArrowsUpDownIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';
import { Uri } from '@/types/types';

import { AngleInput } from './AngleInput';

interface Props {
  propertyUri: Uri;
}

export function RadiusAzimuthElevationControls({ propertyUri }: Props) {
  const [value, setValue, meta] = useProperty('Vec3Property', propertyUri);

  if (!value || !meta) {
    throw Error(`Missing property with uri: ${propertyUri}`);
  }

  return (
    <Fieldset
      p={'xs'}
      pt={5}
      bg={'transparent'}
      legend={
        <PropertyLabel
          name={'Spherical position'}
          description={meta.description}
          visibility={meta.visibility}
          uri={propertyUri}
        />
      }
    >
      <Group gap={'xs'} align={'flex-start'}>
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
    </Fieldset>
  );
}
