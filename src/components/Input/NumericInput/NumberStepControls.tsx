import { Stack } from '@mantine/core';

import { StepControlButton } from './StepControlButton';

interface Props {
  disableMin?: boolean;
  disableMax?: boolean;
  stepHoldDelay?: number;
  stepHoldInterval?: number;
  onChange: (change: number) => void;
  step?: number;
}

export function NumberStepControls(props: Props) {
  // In the numeric inputs, stepping can be done with the keyboard using the up/down
  // keys, so we don't need the step control buttons to be focusable by the keyboard.
  // Hence, we tab index -1 here.
  return (
    <Stack gap={0}>
      <StepControlButton
        direction={'up'}
        disabled={props.disableMax}
        tabIndex={-1}
        {...props}
      />
      <StepControlButton
        direction={'down'}
        disabled={props.disableMin}
        tabIndex={-1}
        {...props}
      />
    </Stack>
  );
}
