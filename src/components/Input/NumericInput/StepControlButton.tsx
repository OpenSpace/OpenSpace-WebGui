import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
  onChange: (change: number) => void;
  stepHoldDelay?: number;
  stepHoldInterval?: number;
  step?: number;
  useStrictClamping?: boolean;
  tabIndex?: number;
}

export function StepControlButton({
  direction,
  onChange,
  stepHoldDelay = 400,
  stepHoldInterval = 100,
  step = 1,
  tabIndex,
  ...props
}: Props) {
  const { t } = useTranslation('components', { keyPrefix: 'input.step-control-button' });

  const stepInterval = useInterval(() => onStepLoop(), stepHoldInterval);
  const { start: startStepInterval, clear: clearTimeout } = useTimeout(
    () => stepInterval.start(),
    stepHoldDelay
  );
  const onStepDone = useCallback((): void => {
    clearTimeout();
    if (stepInterval.active) {
      stepInterval.stop();
    }
  }, [clearTimeout, stepInterval]);

  useEffect(() => {
    // Prevent the step loop from running after the pointer is released, even when the
    // pointer is not over the button
    window.addEventListener('pointerup', onStepDone);
    return () => {
      window.removeEventListener('pointerup', onStepDone);
    };
  }, [onStepDone]);

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
      tabIndex={tabIndex}
      aria-label={
        direction === 'up' ? t('aria-label.increment') : t('aria-label.decrement')
      }
      {...props}
    >
      {direction === 'up' ? <ChevronUpIcon /> : <ChevronDownIcon />}
    </ActionIcon>
  );
}
