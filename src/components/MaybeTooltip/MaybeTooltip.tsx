import { Tooltip, TooltipProps } from '@mantine/core';

interface Props extends TooltipProps {
  showTooltip: boolean;
}

export function MaybeTooltip({ showTooltip, label, children, ...props }: Props) {
  return showTooltip ? (
    <Tooltip label={label} {...props}>
      {children}
    </Tooltip>
  ) : (
    <>{children}</>
  );
}
