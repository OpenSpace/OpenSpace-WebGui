import { Group, NumberInput, Text } from '@mantine/core';

import { NumericSlider } from '@/components/Input/NumericInput/NumericSlider/NumericSlider';
import { useProperty } from '@/hooks/properties';
import { useIsAdvancedUserLevel } from '@/hooks/userLevel';
import { ArrowsLeftRightIcon, ArrowsUpDownIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';
import { Uri } from '@/types/types';

import { PropertyGroupContainer } from './PropertyGroupContainer';

interface Props {
  propertyUri: Uri;
}

export function CartesianControls({ propertyUri }: Props) {
  const [value, setValue, meta] = useProperty('Vec3Property', propertyUri);

  const isAdvancedUser = useIsAdvancedUserLevel();

  if (!value || !meta) {
    throw Error(`Missing property with uri: ${propertyUri}`);
  }

  return (
    <PropertyGroupContainer
      uri={propertyUri}
      type={'Vec3Property'}
      name={'Cartesian position'}
      description={
        'Screenspace position in Cartesian coordinates (x, y, z). The z-coordinate is an advanced property hidden for lower user levels. It controls the distance to the screenspace plane, allowing objects to be layered at different depths.'
      }
      mt={'xs'}
    >
      <Group gap={'xs'} pt={5}>
        <Text size={'sm'}>x</Text>
        <NumberInput
          flex={1}
          maw={70}
          miw={50}
          size={'xs'}
          value={value[0]}
          step={meta.additionalData.step[0]}
          decimalScale={3}
          onChange={(newValue) => setValue([Number(newValue), value[1], value[2]])}
        />
        <ArrowsLeftRightIcon size={IconSize.xs} />
        <NumericSlider
          value={value[0]}
          flex={1}
          miw={50}
          disabled={meta.isReadOnly}
          min={meta.additionalData.min[0]}
          max={meta.additionalData.max[0]}
          step={meta.additionalData.step[0]}
          exponent={meta.additionalData.exponent}
          onInput={(newValue) => setValue([Number(newValue), value[1], value[2]])}
        />
      </Group>
      <Group gap={'xs'}>
        <Text size={'sm'}>y</Text>
        <NumberInput
          flex={1}
          maw={70}
          miw={50}
          size={'xs'}
          value={value[1]}
          step={meta.additionalData.step[1]}
          decimalScale={3}
          onChange={(newValue) => setValue([value[0], Number(newValue), value[2]])}
        />
        <ArrowsUpDownIcon size={IconSize.xs} />
        <NumericSlider
          value={value[1]}
          flex={1}
          miw={50}
          disabled={meta.isReadOnly}
          min={meta.additionalData.min[1]}
          max={meta.additionalData.max[1]}
          step={meta.additionalData.step[1]}
          exponent={meta.additionalData.exponent}
          onInput={(newValue) => setValue([value[0], Number(newValue), value[2]])}
        />
      </Group>
      {isAdvancedUser && (
        <Group gap={'xs'} mt={'xs'}>
          <Text size={'sm'}>z</Text>
          <NumberInput
            flex={1}
            maw={70}
            miw={50}
            size={'xs'}
            value={value[2]}
            step={meta.additionalData.step[2]}
            decimalScale={3}
            onChange={(newValue) => setValue([value[0], value[1], Number(newValue)])}
          />
          <NumericSlider
            value={value[2]}
            flex={1}
            miw={50}
            disabled={meta.isReadOnly}
            min={meta.additionalData.min[2]}
            max={meta.additionalData.max[2]}
            step={meta.additionalData.step[2]}
            exponent={meta.additionalData.exponent}
            onInput={(newValue) => setValue([value[0], value[1], Number(newValue)])}
          />
        </Group>
      )}
    </PropertyGroupContainer>
  );
}
