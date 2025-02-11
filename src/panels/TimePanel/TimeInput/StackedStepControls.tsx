import { PropsWithChildren, useState } from 'react';
import { Stack } from '@mantine/core';
import { useWindowEvent } from '@mantine/hooks';

import { StepControlButton } from '@/components/Input/NumericInput/StepControlButton';

interface Props extends PropsWithChildren {
  onChange: (change: number, shiftKey: boolean) => void;
  step?: number;
}

// TODO: Incorporate Shift key functionality in name somehow
export function StackedStepControls({ onChange, step, children }: Props) {
  const [isHoldingShift, setIsHoldingShift] = useState(false);

  useWindowEvent('keydown', (event: KeyboardEvent) => {
    if (event.shiftKey) {
      setIsHoldingShift(true);
    }
  });

  useWindowEvent('keyup', (event: KeyboardEvent) => {
    if (event.shiftKey) {
      setIsHoldingShift(false);
    }
  });

  function onStep(change: number): void {
    onChange(change, isHoldingShift);
  }

  return (
    <Stack gap={5} align={'center'}>
      <StepControlButton
        direction={'up'}
        step={step}
        onChange={onStep}
        w={'100%'}
        variant={'light'}
        color={'gray'}
      />
      {children}
      <StepControlButton
        direction={'down'}
        step={step}
        onChange={onStep}
        w={'100%'}
        variant={'light'}
        color={'gray'}
      />
    </Stack>
  );
}
