import { PropsWithChildren, useRef } from 'react';
import { ActionIcon, Stack } from '@mantine/core';

import { ChevronDownIcon, ChevronUpIcon } from '@/icons/icons';

/**
 * Based on Mantine NumberInput Control buttons
 * https://github.com/mantinedev/mantine/blob/master/packages/%40mantine/core/src/components/NumberInput/NumberInput.tsx#L406
 */

interface Props extends PropsWithChildren {
  stepHoldDelay?: number;
  stepHoldInterval?: number;
  onChange: (change: number, shiftKey: boolean) => void;
  step?: number;
}
export function HoldableButton({
  stepHoldDelay,
  stepHoldInterval,
  onChange,
  step,
  children
}: Props) {
  // The reference allows us to get the latest state in the `onCallback`, necessary due to
  // how capturing works with the `window.setTimeout` function.
  const shiftKeyRef = useRef(false);
  const onStepTimeoutRef = useRef<number | null>(null);
  const shouldUseStepInterval =
    stepHoldDelay !== undefined && stepHoldInterval !== undefined;

  function downHandler(event: KeyboardEvent): void {
    if (event.key === 'Shift') {
      shiftKeyRef.current = true;
    }
  }

  function upHandler(event: KeyboardEvent): void {
    if (event.key === 'Shift') {
      shiftKeyRef.current = false;
    }
  }

  function onStepHandleChange(isIncrement: boolean, shiftKey?: boolean): void {
    const amount = step ?? 1;
    const change = isIncrement ? amount : -amount;
    onChange(change, shiftKey !== undefined ? shiftKey : shiftKeyRef.current);
  }

  function onStep(
    event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
    isIncrement: boolean
  ): void {
    // Prevent keyboard events to repeatedly trigger the step loop which causes dangling
    // references to the setTimeout function
    if ('repeat' in event) {
      if (event.repeat) {
        return;
      }

      const shouldStep = event.key === 'Enter' || event.code === 'Space';
      if (!shouldStep) {
        return;
      }
    }

    // We pass the shift key on first press since we have not yet added the event
    // listeners. This allows us to read the value on the first callback correctly.
    onStepHandleChange(isIncrement, event.shiftKey);

    // We want to be notified when user holds shiftkey during press
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    // If the timeout has already been set, don't start another one to avoid dangling
    // references
    if (shouldUseStepInterval && onStepTimeoutRef.current === null) {
      onStepTimeoutRef.current = window.setTimeout(
        () => onStepLoop(isIncrement),
        stepHoldDelay
      );
    }
  }

  function onStepLoop(isIncrement: boolean): void {
    onStepHandleChange(isIncrement);

    if (shouldUseStepInterval) {
      onStepTimeoutRef.current = window.setTimeout(
        () => onStepLoop(isIncrement),
        stepHoldInterval
      );
    }
  }

  function onStepDone(): void {
    if (onStepTimeoutRef.current) {
      window.clearTimeout(onStepTimeoutRef.current);
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
      onStepTimeoutRef.current = null;
    }
  }

  function stepControlButton(direction: 'up' | 'down'): React.JSX.Element {
    const isIncrement = direction === 'up';

    return (
      <ActionIcon
        onPointerDown={(event) => {
          onStep(event, isIncrement);
        }}
        onPointerOut={onStepDone}
        onPointerUp={onStepDone}
        onKeyDown={(event) => onStep(event, isIncrement)}
        onKeyUp={() => onStepDone()}
        size={'xs'}
        variant={'light'}
        w={'100%'}
        color={'gray'}
      >
        {direction === 'up' ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </ActionIcon>
    );
  }

  return (
    <Stack gap={5} align={'center'}>
      {stepControlButton('up')}
      {children}
      {stepControlButton('down')}
    </Stack>
  );
}
