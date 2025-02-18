import { PropsWithChildren } from 'react';
import { Stack } from '@mantine/core';

import { StepControlButton } from '@/components/Input/NumericInput/StepControlButton';

interface Props extends PropsWithChildren {
  onChange: (change: number) => void;
  step?: number;
}

export function StackedStepControls({ onChange, step, children }: Props) {
  return (
    <Stack gap={5} align={'center'}>
      <StepControlButton
        direction={'up'}
        step={step}
        onChange={onChange}
        w={'100%'}
        variant={'light'}
        color={'gray'}
      />
      {children}
      <StepControlButton
        direction={'down'}
        step={step}
        onChange={onChange}
        w={'100%'}
        variant={'light'}
        color={'gray'}
      />
    </Stack>
  );
}
