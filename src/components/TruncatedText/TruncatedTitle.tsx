import { PropsWithChildren } from 'react';
import { Title, TitleProps, Tooltip, TooltipProps } from '@mantine/core';
import { useResizeObserver } from '@mantine/hooks';

interface Props extends PropsWithChildren, TitleProps {
  tooltipProps?: Partial<TooltipProps>;
}

/**
 * Component that displays title with truncation and a tooltip. The tooltip shows the full
 * text when hovered over, and is only shown if the text is truncated.
 */
export function TruncatedTitle({ tooltipProps, children, ...rest }: Props) {
  // This will case the component to rerender when the text is resized, which is necessary
  // to determine if the text is truncated or not.
  const [ref] = useResizeObserver();

  const showTooltip: boolean =
    ref.current &&
    (ref.current.scrollWidth > ref.current.clientWidth ||
      ref.current.scrollHeight > ref.current.clientHeight);

  return (
    <Tooltip label={children} {...tooltipProps} disabled={!showTooltip}>
      <Title lineClamp={1} {...rest} ref={ref}>
        {children}
      </Title>
    </Tooltip>
  );
}
