import { useRef, useState } from 'react';
import { MantineStyleProp, NumberInput } from '@mantine/core';

interface Props {
  value: number;
  onEnter: (newValue: number) => void;
  onDiff: (change: number, shiftKey: boolean) => void;
  min?: number;
  max?: number;
  style?: MantineStyleProp;
}

export function InlineInput({ value, onEnter, onDiff, min, max, style }: Props) {
  const [storedValue, setStoredValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const [shiftKey, setShiftKey] = useState(false);

  const ref = useRef<HTMLInputElement>(null);
  // If we are not editing we can update the value and re-render
  if (storedValue !== value && !isFocused) {
    setStoredValue(value);
  }

  // Similar to `NumericInput` component
  function onKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      onEnter(storedValue);
      event.currentTarget.blur();
    }
    if (event.key === 'Escape') {
      event.currentTarget.blur();
    }
    if (event.key === 'Shift') {
      setShiftKey(false);
    }
  }
  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Shift') {
      setShiftKey(true);
    }
  }

  function onValueChange(newValue: number | string) {
    if (typeof newValue === 'number') {
      const diff = newValue - storedValue;
      // TODO: since the onValueChange is called on every keyboard stroke we only call the
      // onUpdate function when changing the values thru arrow keys or the up/down arrows.
      // If the user typed, the value will be updated once the user hits 'Enter' key.
      if (Math.abs(diff) === 1) {
        // TODO: Ideally we want to detect when the change is coming from the plus/minus
        // buttons. But it does not seem that Mantine provide any api to detect such a change
        // The closest I can get for now is to check if the value increased/decreased by 1
        // However, that also means that if we are at 40 and the user types 41 the same
        // code will run and can especially cause issues with 0, and 60 where the wrapping
        // happens...
        if (max !== undefined && min !== undefined) {
          // Wrap around to min/max value
          if (newValue === max) {
            newValue = min;
          } else if (newValue === min) {
            newValue = max;
          }
        }
        onDiff(diff, shiftKey);
        setIsFocused(false);
        // ref.current?.blur();
      }
      setStoredValue(newValue);
    }
  }

  function onBlur() {
    setIsFocused(false);
  }

  function onFocus() {
    setIsFocused(true);
  }

  // TODO: if the controls are unintuitive W/ regards to focus we could render our own
  // buttons and use the custom `HoldableButton` instead
  //   function renderButtons() {
  //     return (
  //       <Stack gap={0}>
  //         <ActionIcon
  //           onClick={() => onValueChange(storedValue + 1)}
  //           size={'sm'}
  //           onPointerDown={(event) => console.log('holding', event.currentTarget.value)}
  //         >
  //           <ExpandLessIcon />
  //         </ActionIcon>
  //         <ActionIcon onClick={() => onValueChange(storedValue - 1)} size={'sm'}>
  //           <ExpandMoreIcon />
  //         </ActionIcon>
  //       </Stack>
  //     );
  //   }

  return (
    <NumberInput
      ref={ref}
      value={storedValue}
      //   rightSection={renderButtons()}
      onKeyUp={onKeyUp}
      onKeyDown={onKeyDown}
      onChange={(val) => onValueChange(val)}
      onFocus={onFocus}
      onBlur={onBlur}
      min={min}
      max={max}
      stepHoldDelay={500}
      stepHoldInterval={50}
      clampBehavior={'strict'}
      style={style}
    />
  );
}
