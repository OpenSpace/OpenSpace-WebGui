import { useTranslation } from 'react-i18next';
import { MultiSelect } from '@mantine/core';

import { PropertyProps } from '@/components/Property/types';
import { useProperty } from '@/hooks/properties';
import { usePropListeningState } from '@/hooks/util';

export function SelectionProperty({ uri, readOnly }: PropertyProps) {
  const { t } = useTranslation('components', {
    keyPrefix: 'property.selection-property'
  });

  const [value, setValue, meta] = useProperty('SelectionProperty', uri);
  const { value: currentValue, setValue: setCurrentValue } = usePropListeningState<
    string[] | undefined
  >(value);

  if (!value || !meta || currentValue === undefined) {
    return <></>;
  }

  const { options } = meta.additionalData;

  function handleChange(newValue: string[]) {
    setValue(newValue);
    setCurrentValue(newValue);
  }

  return (
    <MultiSelect
      aria-label={t('aria-label', { guiName: meta.guiName })}
      disabled={readOnly}
      data={options}
      value={currentValue}
      onChange={handleChange}
      placeholder={value.length === 0 ? t('placeholder-empty-field') : ''}
      searchable
      clearable
    />
  );
}
