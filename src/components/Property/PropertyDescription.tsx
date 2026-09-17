import { useTranslation } from 'react-i18next';
import { Badge, Group, Stack, Text } from '@mantine/core';
import { PropertyVisibility } from 'openspace-api-js/types';

import CopyUriButton from '@/components/CopyUriButton/CopyUriButton';
import styles from '@/theme/global.module.css';
import { Uri } from '@/types/types';

interface Props {
  uri: Uri;
  description: string;
  visibility: PropertyVisibility;
}

/**
 * This component is used to display the description of a property, including a copy
 * button for the URI.
 */
export function PropertyDescription({ uri, description, visibility }: Props) {
  const { t } = useTranslation('components', { keyPrefix: 'property.visibility' });
  return (
    <Stack gap={'xs'}>
      <Text size={'sm'} style={{ wordBreak: 'break-word' }} className={styles.selectable}>
        {description}
      </Text>
      {uri && <CopyUriButton uri={uri} />}
      <Group gap={'xs'}>
        <Text size={'xs'}>{t('title')}:</Text>
        <Badge size={'xs'}>{t(`levels.${visibility}`)}</Badge>
      </Group>
    </Stack>
  );
}
