import { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, Tooltip } from '@mantine/core';

import CopyUriButton from '@/components/CopyUriButton/CopyUriButton';
import { Label } from '@/components/Label/Label';
import { Uri } from '@/types/types';

interface Props {
  name: string;
  description: string | JSX.Element;
  uri: Uri;
  readOnly?: boolean;
}

export function PropertyLabel({ name, description, uri, readOnly = false }: Props) {
  const { t } = useTranslation('components');

  return (
    <Label
      name={
        <>
          {name}
          {readOnly && (
            <Tooltip
              maw={200}
              multiline
              label={t('property.property-label.tooltip-label')}
            >
              <Text span ml={'xs'} size={'xs'} c={'dimmed'}>
                {t('property.property-label.label')}
              </Text>
            </Tooltip>
          )}
        </>
      }
      description={
        <>
          {description}
          {uri && <CopyUriButton uri={uri} />}
        </>
      }
    />
  );
}
