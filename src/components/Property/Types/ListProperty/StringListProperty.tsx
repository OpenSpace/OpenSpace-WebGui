import { useTranslation } from 'react-i18next';

import { Pills } from '@/components/Pills/Pills';
import { PropertyProps } from '@/components/Property/types';
import { useProperty } from '@/hooks/properties';

export function StringListProperty({ uri, readOnly }: PropertyProps) {
  const [value, setValue] = useProperty('StringListProperty', uri);
  const { t } = useTranslation('components');

  if (value === undefined) {
    return <></>;
  }

  return (
    <Pills
      value={value}
      setValue={setValue}
      placeHolderText={t('property.list-property.string-list-placeholder-text')}
      disabled={readOnly}
    />
  );
}
