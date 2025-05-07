import { useTranslation } from 'react-i18next';
import { Paper, Text } from '@mantine/core';

import { StringInput } from '@/components/Input/StringInput';
import { PropertyProps } from '@/components/Property/types';
import { useProperty } from '@/hooks/properties';

export function StringProperty({ uri, readOnly }: PropertyProps) {
  const [value, setValue, meta] = useProperty('StringProperty', uri);
  const { t } = useTranslation('components');

  if (value === undefined || !meta) {
    return <></>;
  }

  if (readOnly) {
    return (
      <Paper px={'sm'} py={5}>
        <Text size={'sm'}>{value}</Text>
      </Paper>
    );
  }
  return (
    <StringInput
      onEnter={setValue}
      value={value}
      aria-label={t('property.list-property.string-list-placeholder-text', {
        guiName: meta.guiName
      })}
    />
  );
}
