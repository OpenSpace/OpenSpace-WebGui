import { useTranslation } from 'react-i18next';
import { Select } from '@mantine/core';

import { PropertyProps } from '@/components/Property/types';
import { useProperty } from '@/hooks/properties';

export function OptionProperty({ uri, readOnly }: PropertyProps) {
  const [value, setValue, meta] = useProperty('OptionProperty', uri);
  const { t } = useTranslation('components');

  if (!meta || value === undefined || !meta.additionalData) {
    return <></>;
  }

  const { options } = meta.additionalData;

  // We need to guard for if there are no options. This can happen if they
  // are added dynamically
  if (!options) {
    return (
      <Select
        aria-label={t('property.option-property.aria-label', { guiName: meta.guiName })}
        placeholder={t('property.option-property.placeholder.no-options')}
        disabled
      />
    );
  }

  return (
    <Select
      aria-label={t('property.option-property.aria-label', { guiName: meta.guiName })}
      placeholder={t('property.option-property.placeholder.options')}
      disabled={readOnly}
      // For each entry in the options object, the numeric value is the key, and the
      // label is the value
      data={Object.entries(options).map(([value, label]) => ({
        value: value,
        label: label
      }))}
      value={value.toString()}
      onChange={(newOption) => newOption && setValue(parseInt(newOption))}
      allowDeselect={false}
    />
  );
}
