import { useTranslation } from 'react-i18next';
import { Group, Text } from '@mantine/core';

import { NumericInput } from '@/components/Input/NumericInput/NumericInput';
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
  const { t } = useTranslation('panel-screenspacerenderable', {
    keyPrefix: 'placement.spherical-controls'
  });

  const [value, setValue, meta] = useProperty('Vec3Property', propertyUri);

  const isAdvancedUser = useIsAdvancedUserLevel();

  if (!value || !meta) {
    throw Error(`Missing property with uri: ${propertyUri}`);
  }

  return (
    <PropertyGroupContainer
      uri={propertyUri}
      type={'Vec3Property'}
      name={t('label')}
      description={t('description')}
      mt={'xs'}
    >
      <Group gap={'xs'} pt={5} align={'flex-start'}>
        <AngleInput
          value={value[1]}
          onChange={(newValue) => setValue([value[0], Number(newValue), value[2]])}
          disabled={meta.isReadOnly}
          ariaLabel={t('azimuth.aria-label')}
          label={
            <Group gap={5} wrap={'nowrap'}>
              <ArrowsLeftRightIcon size={IconSize.xs} />
              <Text size={'sm'}>{t('azimuth.label')}</Text>
            </Group>
          }
        />

        <AngleInput
          value={value[2]}
          onChange={(newValue) => setValue([value[0], value[1], Number(newValue)])}
          disabled={meta.isReadOnly}
          ariaLabel={t('elevation.aria-label')}
          label={
            <Group gap={5} wrap={'nowrap'}>
              <ArrowsUpDownIcon size={IconSize.xs} />
              <Text size={'sm'}>{t('elevation.label')}</Text>
            </Group>
          }
        />
      </Group>
      {isAdvancedUser && (
        <Group gap={'xs'} mt={'xs'} align={'flex-start'}>
          <Text size={'sm'}>{t('radius.label')}</Text>
          <NumericInput
            aria-label={t('radius.aria-label')}
            value={value[0]}
            size={'xs'}
            maw={80}
            flex={1}
            min={meta.additionalData.min[0]}
            max={meta.additionalData.max[0]}
            step={meta.additionalData.step[0]}
            disabled={meta.isReadOnly}
            decimalScale={2}
            onEnter={(newValue) => setValue([Number(newValue), value[1], value[2]])}
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
