import { useRef, useState } from 'react';
import { ActionIcon, Alert, Button, Center, Group, Stack, Text } from '@mantine/core';
import { useWindowEvent } from '@mantine/hooks';

import { useOpenSpaceApi, useSetOpenSpaceTime, useSubscribeToTime } from '@/api/hooks';
import { LockIcon, LockOpenIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';
import { isDateValid } from '@/redux/time/util';

import { TimePart } from '../types';
import { maxDaysInMonth } from '../util';

import { MonthInput } from './MonthInput';
import { TimeIncrementInput } from './TimeIncrementInput';

export function TimeInput() {
  const [useLock, setUseLock] = useState(false);
  const [pendingTime, setPendingTime] = useState(new Date());
  const [isHoldingShift, setIsHoldingShift] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const cappedTime = useAppSelector((state) => state.time.timeCapped);
  const backupTimeString = useAppSelector((state) => state.time.timeString);
  const luaApi = useOpenSpaceApi();
  const { setTime, interpolateTime } = useSetOpenSpaceTime();
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

  function interpolateToPendingTime() {
    interpolateTime(pendingTime);
  }

  function setToPendingTime() {
    setTime(pendingTime);
  }

  function updateTime(data: {
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
      setTime(data.time);
      return;
    }

    // Interpolate
    if (data.relative) {
      luaApi?.time.interpolateTimeRelative(data.delta);
    } else {
      interpolateTime(data.time);
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
      case TimePart.Months: {
        // Adjust the day when transitioning from a month with 31 days to a month with
        // fewer days. If the current day is 31 and the next month has only 30 ( or fewer)
        // days, the Date object would interpret this as rolling over into the next month
        // e.g., March 31 -> April 30 + 1 -> May 1. To prevent this, we clamp the day to
        // the maximum valid day in the next month

        // Determine the maximum number of days in the target month
        const maxDaysInNextMonth = maxDaysInMonth(
          newTime.getUTCFullYear(),
          newTime.getUTCMonth() + change
        );
        // Clamp days for next month
        newTime.setUTCDate(Math.min(maxDaysInNextMonth, newTime.getUTCDate()));
        // Update month
        newTime.setUTCMonth(newTime.getUTCMonth() + change);
        break;
      }
      case TimePart.Years: {
        // We want to handle february leap years in the same way we do with each month
        // Get the max days in the new month
        const maxDaysInNextMonth = maxDaysInMonth(
          newTime.getUTCFullYear() + change,
          newTime.getUTCMonth()
        );
        // Clamp days for next month
        newTime.setUTCDate(Math.min(maxDaysInNextMonth, newTime.getUTCDate()));
        // Update year
        newTime.setUTCFullYear(newTime.getUTCFullYear() + change);
        break;
      }
      default:
        throw Error(`Unhandled 'TimePart' case: ${timePart}`);
    }

    updateTime({
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
      case TimePart.Months: {
        // Adjust the day when transitioning from a month with 31 days to a month with
        // fewer days. If the current day is 31 and the next month has only 30 ( or fewer)
        // days, the Date object would interpret this as rolling over into the next month
        // e.g., March 31 -> April 30 + 1 -> May 1. To prevent this, we clamp the day to
        // the maximum valid day in the next month

        // Determine the maximum number of days in the target month
        const maxDaysInNextMonth = maxDaysInMonth(newTime.getUTCFullYear(), value);
        // Clamp days for next month
        newTime.setUTCDate(Math.min(maxDaysInNextMonth, newTime.getUTCDate()));
        // Update month
        newTime.setUTCMonth(value);
        break;
      }
      case TimePart.Years: {
        // We want to handle february leap years in the same way we do with each month
        // Get the max days in the new month
        const maxDaysInNextMonth = maxDaysInMonth(value, newTime.getUTCMonth());
        // Clamp days for next month
        newTime.setUTCDate(Math.min(maxDaysInNextMonth, newTime.getUTCDate()));
        // Update year
        newTime.setUTCFullYear(value);
        break;
      }
      default:
        throw Error(`Unhandled 'TimePart' case: ${timePart}`);
    }

    updateTime({
      time: newTime,
      immediate: true,
      delta: 0, // This variable is not relevant in this case
      relative: false
    });
  }

  function onChange(value: number | string): void {
    // Mantine's NumberInput can return either a string or a number.
    // Since our wrapper does not handle string values, we ignore them.
    if (typeof value === 'string') {
      return;
    }

    // Validate the new date to ensure the year is within the valid JavaScript Date range
    const newTime = new Date(timeRef.current);
    const ms = newTime.setUTCFullYear(value);

    if (isNaN(ms)) {
      setErrorMessage(`Year '${value}' is outside allowed year range (-271821, 275760)`);
    } else {
      setErrorMessage('');
    }
  }

  if (cappedTime === undefined) {
    return (
      <Center p={'xl'} style={{ flexDirection: 'column' }}>
        <Text>{backupTimeString}</Text>
        <Text c={'red'}>Can't interact with dates outside ±270.000 years</Text>
      </Center>
    );
  }

  return (
    <Stack
      gap={'xs'}
      p={'xs'}
      style={{
        outline: useLock ? '3px solid var(--mantine-primary-color-filled)' : undefined
      }}
    >
      <Group gap={'xs'} justify={'center'}>
        <ActionIcon onClick={toggleLock} variant={useLock ? 'filled' : 'default'}>
          {useLock ? <LockIcon /> : <LockOpenIcon />}
        </ActionIcon>
        <Group gap={5} wrap={'nowrap'}>
          <TimeIncrementInput
            value={time.getUTCFullYear()}
            onInputEnter={(value) => onTimeInput(TimePart.Years, value)}
            onInputChangeStep={(change) => onTimeInputRelative(TimePart.Years, change)}
            onInputChange={onChange}
            onInputBlur={() => {
              if (errorMessage) {
                setErrorMessage('');
              }
            }}
            error={errorMessage !== ''}
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
            onInputEnter={(value) => onTimeInput(TimePart.Days, value)}
            onInputChangeStep={(change) => onTimeInputRelative(TimePart.Days, change)}
            min={1}
            max={maxDaysInMonth(time.getUTCFullYear(), time.getUTCMonth())}
            w={40}
          />
        </Group>
        <Group gap={5} wrap={'nowrap'}>
          <TimeIncrementInput
            value={time.getUTCHours()}
            onInputEnter={(value) => onTimeInput(TimePart.Hours, value)}
            onInputChangeStep={(change) => onTimeInputRelative(TimePart.Hours, change)}
            min={0}
            max={24}
            w={40}
          />
          <TimeIncrementInput
            value={time.getUTCMinutes()}
            onInputEnter={(value) => onTimeInput(TimePart.Minutes, value)}
            onInputChangeStep={(change) => onTimeInputRelative(TimePart.Minutes, change)}
            min={0}
            max={60}
            w={40}
          />
          <TimeIncrementInput
            value={time.getUTCSeconds()}
            onInputEnter={(value) => onTimeInput(TimePart.Seconds, value)}
            onInputChangeStep={(change) => onTimeInputRelative(TimePart.Seconds, change)}
            min={0}
            max={60}
            w={40}
          />
        </Group>
      </Group>
      {errorMessage && <Alert color={'red'}>{errorMessage}</Alert>}
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
  );
}
