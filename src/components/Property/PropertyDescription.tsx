import { Text } from '@mantine/core';

import CopyUriButton from '@/components/CopyUriButton/CopyUriButton';
import styles from '@/theme/global.module.css';
import { Uri } from '@/types/types';

interface Props {
  uri: Uri;
  description: string;
}

/**
 * This component is used to display the description of a property, including a copy
 * button for the URI.
 */
export function PropertyDescription({ uri, description }: Props) {
  return (
    <>
      <Text style={{ wordBreak: 'break-word' }} className={styles.selectable}>
        {description}
      </Text>
      {uri && <CopyUriButton uri={uri} />}
    </>
  );
}
