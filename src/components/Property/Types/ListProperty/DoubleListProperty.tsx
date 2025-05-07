import { useTranslation } from 'react-i18next';

import { Pills } from '@/components/Pills/Pills';
import { PropertyProps } from '@/components/Property/types';
import { useProperty } from '@/hooks/properties';

export function DoubleListProperty({ uri, readOnly }: PropertyProps) {
  const [value, setValue] = useProperty('DoubleListProperty', uri);
  const { t } = useTranslation('components');

  if (value === undefined) {
    return <></>;
  }

  function setValueString(values: string[]) {
    setValue(values.map((value) => parseFloat(value)).filter((value) => !isNaN(value)));
  }

  return (
    <Pills
      value={value.map((v) => v.toString())}
      setValue={setValueString}
      placeHolderText={t('property.list-property.double-list-placeholder-text')}
      disabled={readOnly}
    />
  );
}
