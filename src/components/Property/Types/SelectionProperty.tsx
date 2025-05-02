import { useTranslation } from 'react-i18next';
import { MultiSelect } from '@mantine/core';

import { PropertyProps } from '@/components/Property/types';
import { useProperty } from '@/hooks/properties';
import { usePropListeningState } from '@/hooks/util';

export function SelectionProperty({ uri, readOnly }: PropertyProps) {
  const [value, setValue, meta] = useProperty('SelectionProperty', uri);
  const { value: currentValue, setValue: setCurrentValue } = usePropListeningState<
    string[] | undefined
  >(value);
  const { t } = useTranslation('components');

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
      aria-label={t('property.selection-property.aria-label', { guiName: meta.guiName })}
      disabled={readOnly}
      data={options}
      value={currentValue}
      onChange={handleChange}
      placeholder={
        value.length === 0 ? t('property.selection-property.placeholder-empty-field') : ''
      }
      searchable
      clearable
    />
  );
}
