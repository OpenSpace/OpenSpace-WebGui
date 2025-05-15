import { Text } from '@mantine/core';

import { ChevronRightIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';

interface Props {
  path: React.ReactNode[];
}

export function FolderPath({ path }: Props) {
  return (
    <Text style={{ display: 'flex', alignItems: 'center' }}>
      {path.map((element, index) => (
        <>
          {index > 0 && (
            <ChevronRightIcon size={IconSize.sm} style={{ margin: '0 4px' }} />
          )}
          {element}
        </>
      ))}
    </Text>
  );
}
