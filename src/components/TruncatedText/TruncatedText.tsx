import { PropsWithChildren } from 'react';
import { Text, TextProps, Tooltip, TooltipProps } from '@mantine/core';
import { useResizeObserver } from '@mantine/hooks';

interface Props extends PropsWithChildren, TextProps {
  tooltipProps?: TooltipProps;
}

/**
 * Component that displays text with truncation and a tooltip. The tooltip shows the full
 * text when hovered over, and is only shown if the text is truncated.
 */
export function TruncatedText({ tooltipProps, children, ...rest }: Props) {
  // This will case the component to rerender when the text is resized, which is necessary
  // to determine if the text is truncated or not.
  const [ref] = useResizeObserver();

  const showTooltip: boolean =
    ref.current && ref.current.scrollWidth > ref.current.clientWidth;

  return (
    <Tooltip
      label={children}
      {...tooltipProps}
      style={{ display: showTooltip ? 'block' : 'none' }}
    >
      <Text truncate {...rest} ref={ref}>
        {children}
      </Text>
    </Tooltip>
  );
}
