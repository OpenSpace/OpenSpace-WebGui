import { PropsWithChildren } from 'react';
import { MantineStyleProps, Stack } from '@mantine/core';

import { StepControlButton } from '@/components/Input/NumericInput/StepControlButton';

interface Props extends PropsWithChildren, MantineStyleProps {
  onChange: (change: number) => void;
  step?: number;
  disabled?: boolean;
}

export function StackedStepControls({
  onChange,
  step,
  disabled,
  children,
  ...styleProps
}: Props) {
  return (
    <Stack gap={5} align={'center'} {...styleProps}>
      <StepControlButton
        direction={'up'}
        step={step}
        onChange={onChange}
        w={'100%'}
        variant={'light'}
        color={'gray'}
        disabled={disabled}
      />
      {children}
      <StepControlButton
        direction={'down'}
        step={step}
        onChange={onChange}
        w={'100%'}
        variant={'light'}
        color={'gray'}
        disabled={disabled}
      />
    </Stack>
  );
}
