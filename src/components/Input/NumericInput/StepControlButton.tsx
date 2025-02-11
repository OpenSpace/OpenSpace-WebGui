import { useEffect } from 'react';
import { ActionIcon, ActionIconProps } from '@mantine/core';
import { useInterval, useTimeout } from '@mantine/hooks';

import { ChevronDownIcon, ChevronUpIcon } from '@/icons/icons';

/**
 * Based on Mantine NumberInput Control buttons
 * https://github.com/mantinedev/mantine/blob/master/packages/%40mantine/core/src/components/NumberInput/NumberInput.tsx#L456
 */

type StepDirection = 'up' | 'down';

interface Props extends ActionIconProps {
  direction: StepDirection;
  stepHoldDelay?: number;
  stepHoldInterval?: number;
  onChange: (change: number) => void;
  step?: number;
  useStrictClamping?: boolean;
}

export function StepControlButton({
  direction,
  stepHoldDelay = 200,
  stepHoldInterval = 50,
  onChange,
  step = 1,
  ...props
}: Props) {
  const stepInterval = useInterval(() => onStepLoop(), stepHoldInterval);
  const { start: startStepInterval, clear: clearTimeout } = useTimeout(
    () => stepInterval.start(),
    stepHoldDelay
  );

  useEffect(() => {
    // Prevent the step loop from running after the pointer is released, even when the
    // pointer is not over the button
    window.addEventListener('pointerup', onStepDone);
    return () => {
      window.removeEventListener('pointerup', onStepDone);
    };
  });

  function onStepHandleChange(): void {
    const change = direction === 'up' ? step : -step;
    onChange(change);
  }

  function onStep(): void {
    onStepHandleChange();
    startStepInterval();
  }

  function onStepLoop(): void {
    onStepHandleChange();
  }

  function onStepDone(): void {
    clearTimeout();
    if (stepInterval.active) {
      stepInterval.stop();
    }
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLElement>): void {
    // Prevent keyboard events to repeatedly trigger the step loop
    if (event.repeat) {
      return;
    }

    if (event.key === 'Enter' || event.key === 'Space') {
      onStep();
    }
    if (event.key === 'Escape') {
      event.currentTarget.blur();
    }
  }

  return (
    <ActionIcon
      onPointerDown={onStep}
      onPointerUp={onStepDone}
      onKeyDown={onKeyDown}
      onKeyUp={onStepDone}
      size={'xs'}
      variant={'transparent'}
      {...props}
    >
      {direction === 'up' ? <ChevronUpIcon /> : <ChevronDownIcon />}
    </ActionIcon>
  );
}
