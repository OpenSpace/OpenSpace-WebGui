import { Text } from '@mantine/core';

import { ChevronRightIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';
import React from 'react';

interface Props {
  path: (React.JSX.Element | string)[];
}

export function FolderPath({ path }: Props) {
  return (
    <Text style={{ display: 'flex', alignItems: 'center' }}>
      {path.map((element, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRightIcon size={IconSize.sm} style={{ margin: '0 4px' }} />
          )}
          {element}
        </React.Fragment>
      ))}
    </Text>
  );
}
