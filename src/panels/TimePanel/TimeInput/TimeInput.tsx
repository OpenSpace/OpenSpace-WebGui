import { useRef, useState } from 'react';
import { ActionIcon, Button, Center, Group, Stack, Text } from '@mantine/core';
import { useWindowEvent } from '@mantine/hooks';

import { useOpenSpaceApi, useSubscribeToTime } from '@/api/hooks';
import { LockIcon, LockOpenIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';
import { isDateValid } from '@/redux/time/util';

import { TimePart } from '../types';
import { setDate } from '../util';

import { MonthInput } from './MonthInput';
import { TimeIncrementInput } from './TimeIncrementInput';

export function TimeInput() {
  const [useLock, setUseLock] = useState(false);
  const [pendingTime, setPendingTime] = useState(new Date(''));
  const [isHoldingShift, setIsHoldingShift] = useState(false);

  const cappedTime = useAppSelector((state) => state.time.timeCapped);
  const luaApi = useOpenSpaceApi();
  useSubscribeToTime();

  const cappedDate = new Date(cappedTime ?? '');
  const time = useLock ? pendingTime : cappedDate;

  // @TODO (2025-02-12, emmbr) is this ref really recessary?
  // To avoid stale state and javascript capture magic, we need to set the time
  // to a ref so we can use the latest time in the functions in the component
  const timeRef = useRef(time);
  timeRef.current = time;

  useWindowEvent('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Shift' && !event.repeat) {
      setIsHoldingShift(true);
    }
  });

  useWindowEvent('keyup', (event: KeyboardEvent) => {
    if (event.key === 'Shift' && !event.repeat) {
      setIsHoldingShift(false);
    }
  });

  function toggleLock() {
    setPendingTime(new Date(timeRef.current));
    setUseLock((current) => !current);
  }

  function interpolateDate(newTime: Date) {
    const fixedTimeString = newTime.toJSON().replace('Z', '');
    luaApi?.time.interpolateTime(fixedTimeString);
  }

  function interpolateToPendingTime() {
    interpolateDate(pendingTime);
  }

  function setToPendingTime() {
    setDate(luaApi, pendingTime);
  }

  function setTime(data: {
    time: Date;
    immediate: boolean; // If not, interpolate
    delta: number;
    relative: boolean;
  }) {
    if (!isDateValid(data.time)) {
      return;
    }

    if (useLock) {
      // If we're in locked mode, just set the pending timestamp. this timestamp will
      // be used when the user clicks the "interpolate" or "set" button
      setPendingTime(data.time);
      return;
    }

    if (data.immediate) {
      setDate(luaApi, data.time);
      return;
    }

    // Interpolate
    if (data.relative) {
      luaApi?.time.interpolateTimeRelative(data.delta);
    } else {
      interpolateDate(data.time);
    }
  }

  function onTimeInputRelative(timePart: TimePart, change: number) {
    // Update the current time stamp with the change
    const newTime = new Date(timeRef.current);
    switch (timePart) {
      case TimePart.Milliseconds:
        newTime.setUTCMilliseconds(newTime.getUTCMilliseconds() + change);
        break;
      case TimePart.Seconds:
        newTime.setUTCSeconds(newTime.getUTCSeconds() + change);
        break;
      case TimePart.Minutes:
        newTime.setUTCMinutes(newTime.getUTCMinutes() + change);
        break;
      case TimePart.Hours:
        newTime.setUTCHours(newTime.getUTCHours() + change);
        break;
      case TimePart.Days:
        newTime.setUTCDate(newTime.getUTCDate() + change);
        break;
      case TimePart.Months:
        newTime.setUTCMonth(newTime.getUTCMonth() + change);
        break;
      case TimePart.Years:
        newTime.setUTCFullYear(newTime.getUTCFullYear() + change);
        break;
      default:
        throw Error(`Unhandled 'TimePart' case: ${timePart}`);
    }

    setTime({
      time: newTime,
      immediate: isHoldingShift,
      delta: (newTime.getTime() - timeRef.current.getTime()) / 1000,
      relative: true
    });
  }

  function onTimeInput(timePart: TimePart, value: number) {
    const newTime = new Date(timeRef.current);
    switch (timePart) {
      case TimePart.Milliseconds:
        newTime.setUTCMilliseconds(value);
        break;
      case TimePart.Seconds:
        newTime.setUTCSeconds(value);
        break;
      case TimePart.Minutes:
        newTime.setUTCMinutes(value);
        break;
      case TimePart.Hours:
        newTime.setUTCHours(value);
        break;
      case TimePart.Days:
        newTime.setUTCDate(value);
        break;
      case TimePart.Months:
        newTime.setUTCMonth(value);
        break;
      case TimePart.Years:
        newTime.setUTCFullYear(value);
        break;
      default:
        throw Error(`Unhandled 'TimePart' case: ${timePart}`);
    }

    setTime({
      time: newTime,
      immediate: true,
      delta: 0, // This variable is not relevant in this case
      relative: false
    });
  }

  return cappedTime ? (
    <Stack
      gap={'xs'}
      p={'xs'}
      style={{
        outline: useLock ? '3px solid var(--mantine-primary-color-filled)' : undefined
      }}
    >
      <Group gap={'xs'} justify={'center'}>
        <ActionIcon onClick={toggleLock} variant={useLock ? 'filled' : 'light'}>
          {useLock ? <LockIcon /> : <LockOpenIcon />}
        </ActionIcon>
        <Group gap={5} wrap={'nowrap'}>
          <TimeIncrementInput
            value={time.getUTCFullYear()}
            onInputChange={(value) => onTimeInput(TimePart.Years, value)}
            onInputChangeStep={(change) => onTimeInputRelative(TimePart.Years, change)}
            w={65}
          />
          <MonthInput
            month={time.getUTCMonth()}
            onInputChange={(value) => onTimeInput(TimePart.Months, value)}
            onInputChangeStep={(change) => onTimeInputRelative(TimePart.Months, change)}
            w={55}
          />

          <TimeIncrementInput
            value={time.getUTCDate()}
            onInputChange={(value) => onTimeInput(TimePart.Days, value)}
            onInputChangeStep={(change) => onTimeInputRelative(TimePart.Days, change)}
            min={1}
            max={31}
            w={40}
          />
        </Group>
        <Group gap={5} wrap={'nowrap'}>
          <TimeIncrementInput
            value={time.getUTCHours()}
            onInputChange={(value) => onTimeInput(TimePart.Hours, value)}
            onInputChangeStep={(change) => onTimeInputRelative(TimePart.Hours, change)}
            min={0}
            max={24}
            w={40}
          />
          <TimeIncrementInput
            value={time.getUTCMinutes()}
            onInputChange={(value) => onTimeInput(TimePart.Minutes, value)}
            onInputChangeStep={(change) => onTimeInputRelative(TimePart.Minutes, change)}
            min={0}
            max={60}
            w={40}
          />
          <TimeIncrementInput
            value={time.getUTCSeconds()}
            onInputChange={(value) => onTimeInput(TimePart.Seconds, value)}
            onInputChangeStep={(change) => onTimeInputRelative(TimePart.Seconds, change)}
            min={0}
            max={60}
            w={40}
          />
        </Group>
      </Group>
      {useLock && (
        <Group gap={'xs'} grow>
          <Button
            onClick={() => {
              interpolateToPendingTime();
              setUseLock(false);
            }}
          >
            Interpolate
          </Button>
          <Button
            onClick={() => {
              setToPendingTime();
              setUseLock(false);
            }}
          >
            Set
          </Button>
          <Button variant={'outline'} onClick={() => setUseLock(false)}>
            Cancel
          </Button>
        </Group>
      )}
    </Stack>
  ) : (
    <Center p={'xl'}>
      <Text>Date out of range</Text>
    </Center>
  );
}
