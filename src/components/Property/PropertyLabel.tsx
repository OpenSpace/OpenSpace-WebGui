import { useTranslation } from 'react-i18next';
import { Text, Tooltip } from '@mantine/core';

import { Label } from '@/components/Label/Label';
import { Uri } from '@/types/types';

import { PropertyDescription } from './PropertyDescription';

interface Props {
  name: string;
  uri: Uri;
  description?: string;
  readOnly?: boolean;
}

export function PropertyLabel({ name, uri, description, readOnly = false }: Props) {
  const { t } = useTranslation('components', { keyPrefix: 'property.property-label' });

  return (
    <Label
      name={
        <>
          {name}
          {readOnly && (
            <Tooltip maw={200} multiline label={t('read-only-tooltip')}>
              <Text span ml={'xs'} size={'xs'} c={'dimmed'}>
                {`(${t('read-only-label')})`}
              </Text>
            </Tooltip>
          )}
        </>
      }
      info={<PropertyDescription uri={uri} description={description || ''} />}
    />
  );
}
