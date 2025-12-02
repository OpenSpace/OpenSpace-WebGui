import { useTranslation } from 'react-i18next';

import { Pills } from '@/components/Pills/Pills';
import { PropertyProps } from '@/components/Property/types';
import { useProperty } from '@/hooks/properties';

export function DoubleListProperty({ uri, readOnly }: PropertyProps) {
  const { t } = useTranslation('components', { keyPrefix: 'property.list-property' });

  const [value, setValue, meta] = useProperty('DoubleListProperty', uri);

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
      placeHolderText={t('double-list-placeholder-text')}
      ariaLabel={t('aria-label', { guiName: meta?.guiName })}
      disabled={readOnly}
    />
  );
}
