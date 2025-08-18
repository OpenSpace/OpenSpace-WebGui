import { useTranslation } from 'react-i18next';
import { Text, Group } from '@mantine/core';

import CopyUriButton from '@/components/CopyUriButton/CopyUriButton';
import styles from '@/theme/global.module.css';
import { Uri } from '@/types/types';
import { PropertyVisibility } from '@/types/Property/property';

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
  const tVisibility = t(visibility);
  return (
    <>
      <Text style={{ wordBreak: 'break-word' }} className={styles.selectable}>
        {description}
      </Text>
      {uri && <CopyUriButton uri={uri} />}
      <Group gap={'xs'}>
        <Text>Visibility Level:</Text>
        <Text>{tVisibility}</Text>
      </Group>
    </>
  );
}
