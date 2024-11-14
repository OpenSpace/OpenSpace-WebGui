import { useRef } from 'react';
import { ActionIcon, Stack } from '@mantine/core';

import { ExpandLessIcon, ExpandMoreIcon } from '@/icons/icons';

/**
 * Based on Mantine NumberInput Control buttons
 * https://github.com/mantinedev/mantine/blob/master/packages/%40mantine/core/src/components/NumberInput/NumberInput.tsx#L406
 */

interface Props {
  stepHoldDelay?: number;
  stepHoldInterval?: number;
  onChange: (change: number, shiftKey: boolean) => void;
  step?: number;
}
export function HoldableButton({
  stepHoldDelay,
  stepHoldInterval,
  onChange,
  step
}: Props) {
  // The reference allows us to get the latest state in the `onCallback`, necessary due to
  // how capturing works with the `window.setTimeout` function.
  const shiftKeyRef = useRef(false);
  const onStepTimeoutRef = useRef<number | null>(null);
  const shouldUseStepInterval =
    stepHoldDelay !== undefined && stepHoldInterval !== undefined;

  function downHandler(event: KeyboardEvent) {
    if (event.key === 'Shift') {
      shiftKeyRef.current = true;
    }
  }

  function upHandler(event: KeyboardEvent) {
    if (event.key === 'Shift') {
      shiftKeyRef.current = false;
    }
  }

  function onStepHandleChange(isIncrement: boolean, shiftKey?: boolean) {
    const amount = step ?? 1;
    const change = isIncrement ? amount : -amount;
    onChange(change, shiftKey !== undefined ? shiftKey : shiftKeyRef.current);
  }

  function onStep(
    event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
    isIncrement: boolean
  ) {
    event.preventDefault();
    // We pass the shift key on first press since we have not yet added the event
    // listeners. This allows us to read the value on the first callback correctly.
    onStepHandleChange(isIncrement, event.shiftKey);

    // We want to be notified when user holds shiftkey during press
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    if (shouldUseStepInterval) {
      onStepTimeoutRef.current = window.setTimeout(
        () => onStepLoop(isIncrement),
        stepHoldDelay
      );
    }
  }

  function onStepLoop(isIncrement: boolean) {
    onStepHandleChange(isIncrement);

    if (shouldUseStepInterval) {
      onStepTimeoutRef.current = window.setTimeout(
        () => onStepLoop(isIncrement),
        stepHoldInterval
      );
    }
  }

  function onStepDone() {
    if (onStepTimeoutRef.current) {
      window.clearTimeout(onStepTimeoutRef.current);
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
      onStepTimeoutRef.current = null;
    }
  }

  return (
    <Stack gap={0}>
      <ActionIcon
        onMouseDown={(event) => event.preventDefault()}
        onPointerDown={(event) => {
          onStep(event, true);
        }}
        onPointerOut={onStepDone}
        onPointerUp={onStepDone}
        size={'xs'}
      >
        <ExpandLessIcon />
      </ActionIcon>
      <ActionIcon
        onMouseDown={(event) => event.preventDefault()}
        onPointerDown={(event) => {
          onStep(event, false);
        }}
        onPointerOut={onStepDone}
        onPointerUp={onStepDone}
        size={'xs'}
      >
        <ExpandMoreIcon />
      </ActionIcon>
    </Stack>
  );
}
