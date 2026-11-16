import { PropsWithChildren } from 'react';
import { Title, TitleProps, Tooltip, TooltipProps } from '@mantine/core';

import { useIsTruncated } from './hooks';

interface Props extends PropsWithChildren, TitleProps {
  tooltipProps?: Partial<TooltipProps>;
}

/**
 * Component that displays title with truncation and a tooltip. The tooltip shows the full
 * text when hovered over, and is only shown if the text is truncated.
 */
export function TruncatedTitle({ tooltipProps, children, style, ...rest }: Props) {
  const { ref, isTruncated } = useIsTruncated();

  return (
    <Tooltip label={children} {...tooltipProps} disabled={!isTruncated}>
      <Title
        lineClamp={1}
        {...rest}
        ref={ref}
        style={{
          wordBreak: 'break-all',
          overflowWrap: 'anywhere',
          hyphens: 'none',
          ...(style ?? {})
        }}
      >
        {children}
      </Title>
    </Tooltip>
  );
}
