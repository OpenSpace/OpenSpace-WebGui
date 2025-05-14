import { useTranslation } from 'react-i18next';

import { Pills } from '@/components/Pills/Pills';
import { PropertyProps } from '@/components/Property/types';
import { useProperty } from '@/hooks/properties';

export function IntListProperty({ uri, readOnly }: PropertyProps) {
  const [value, setValue] = useProperty('IntListProperty', uri);
  const { t } = useTranslation('components', { keyPrefix: 'property.list-property' });

  if (value === undefined) {
    return <></>;
  }

  function setValueFromString(values: string[]) {
    setValue(values.map((value) => parseInt(value)).filter((value) => !isNaN(value)));
  }

  return (
    <Pills
      value={value.map((value) => value.toString())}
      setValue={setValueFromString}
      placeHolderText={t('int-list-placeholder-text')}
      disabled={readOnly}
    />
  );
}
