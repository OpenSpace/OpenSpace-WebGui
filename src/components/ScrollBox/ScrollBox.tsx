import { PropsWithChildren } from 'react';
import { Box, BoxProps } from '@mantine/core';

import styles from './ScrollBox.module.css';

interface Props extends BoxProps, PropsWithChildren {
  ref?: React.RefObject<HTMLDivElement | null>;
  direction?: 'vertical' | 'horizontal' | 'both';
}

export function ScrollBox({ ref, direction = 'vertical', children, ...props }: Props) {
  const vertical = direction === 'vertical' || direction === 'both';
  const horizontal = direction === 'horizontal' || direction === 'both';
  return (
    <Box
      ref={ref}
      style={{
        overflowX: horizontal ? 'auto' : 'hidden',
        overflowY: vertical ? 'auto' : 'hidden'
      }}
      className={styles.scroller}
      onWheel={(event) => {
        if (direction === 'horizontal') {
          event.currentTarget.scrollLeft += event.deltaY;
        }
      }}
      {...props}
    >
      {children}
    </Box>
  );
}
