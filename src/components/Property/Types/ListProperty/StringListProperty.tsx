import { useTranslation } from 'react-i18next';

import { Pills } from '@/components/Pills/Pills';
import { PropertyProps } from '@/components/Property/types';
import { useProperty } from '@/hooks/properties';

export function StringListProperty({ uri, readOnly }: PropertyProps) {
  const { t } = useTranslation('components', { keyPrefix: 'property.list-property' });

  const [value, setValue, meta] = useProperty('StringListProperty', uri);

  if (value === undefined) {
    return <></>;
  }

  return (
    <Pills
      value={value}
      setValue={setValue}
      placeHolderText={t('string-list-placeholder-text')}
      ariaLabel={t('aria-label', { guiName: meta?.guiName })}
      disabled={readOnly}
    />
  );
}
