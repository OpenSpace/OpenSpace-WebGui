import { Stack, UnstyledButtonProps } from '@mantine/core';

import { StepControlButton } from './StepControlButton';

interface Props extends UnstyledButtonProps {
  disableMin?: boolean;
  disableMax?: boolean;
  stepHoldDelay?: number;
  stepHoldInterval?: number;
  onChange: (change: number) => void;
  step?: number;
}

export function NumberStepControls({
  disableMin,
  disableMax,
  stepHoldDelay,
  stepHoldInterval,
  onChange,
  step
}: Props) {
  const commonProps = {
    onChange,
    step,
    stepHoldDelay,
    stepHoldInterval,
    // In the numeric inputs, stepping can be done with the keyboard using the up/down
    // keys, so we don't need the step control buttons to be focusable by the keyboard
    tabIndex: -1
  };
  return (
    <Stack gap={0}>
      <StepControlButton direction={'up'} disabled={disableMax} {...commonProps} />
      <StepControlButton direction={'down'} disabled={disableMin} {...commonProps} />
    </Stack>
  );
}
