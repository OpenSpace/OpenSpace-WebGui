import { Text } from '@mantine/core';

import { ChevronRightIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';
import React from 'react';

interface Props {
  // Each step in the can be a string or a React element, such as an icon
  path: (React.JSX.Element | string)[];
}

export function FolderPath({ path }: Props) {
  return (
    <Text style={{ display: 'flex', alignItems: 'center' }}>
      {path.map((element, index) => (
        <React.Fragment key={index}>
          {/* If it's not the first element, add a chevron icon */}
          {index > 0 && (
            <ChevronRightIcon size={IconSize.sm} style={{ margin: '0 4px' }} />
          )}
          {element}
        </React.Fragment>
      ))}
    </Text>
  );
}
