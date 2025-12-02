import { useTranslation } from 'react-i18next';
import { Select } from '@mantine/core';

import { PropertyProps } from '@/components/Property/types';
import { useProperty } from '@/hooks/properties';

export function OptionProperty({ uri, readOnly }: PropertyProps) {
  const { t } = useTranslation('components', { keyPrefix: 'property.option-property' });

  const [value, setValue, meta] = useProperty('OptionProperty', uri);

  if (!meta || value === undefined || !meta.additionalData) {
    return <></>;
  }

  const { options } = meta.additionalData;

  // We need to guard for if there are no options. This can happen if they
  // are added dynamically
  if (!options) {
    return (
      <Select
        aria-label={t('aria-label', { guiName: meta.guiName })}
        placeholder={t('placeholder.no-options')}
        disabled
      />
    );
  }

  return (
    <Select
      aria-label={t('aria-label', { guiName: meta.guiName })}
      placeholder={t('placeholder.options')}
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
