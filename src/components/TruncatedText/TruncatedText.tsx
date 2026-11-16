import { PropsWithChildren } from 'react';
import { Text, TextProps, Tooltip, TooltipProps } from '@mantine/core';

import { useIsTruncated } from './hooks';

interface Props extends PropsWithChildren, TextProps {
  tooltipProps?: Partial<TooltipProps>;
}

/**
 * Component that displays text with truncation and a tooltip. The tooltip shows the full
 * text when hovered over, and is only shown if the text is truncated.
 */
export function TruncatedText({ tooltipProps, children, style, ...rest }: Props) {
  const { ref, isTruncated } = useIsTruncated();

  return (
    <Tooltip label={children} {...tooltipProps} display={isTruncated ? 'block' : 'none'}>
      <Text
        truncate
        style={{
          wordBreak: 'break-all',
          overflowWrap: 'anywhere',
          hyphens: 'none',
          ...(style ?? {})
        }}
        {...rest}
        ref={ref}
      >
        {children}
      </Text>
    </Tooltip>
  );
}
