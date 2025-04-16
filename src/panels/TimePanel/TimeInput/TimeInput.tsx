import { useRef, useState } from 'react';
import {
  ActionIcon,
  Alert,
  Button,
  Group,
  Paper,
  Stack,
  Text,
  Tooltip
} from '@mantine/core';
import { useWindowEvent } from '@mantine/hooks';

import { useOpenSpaceApi } from '@/api/hooks';
import { useSubscribeToTime } from '@/hooks/topicSubscriptions';
import { useSetOpenSpaceTime } from '@/hooks/util';
import { LockIcon, LockOpenIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';
import { isDateValid } from '@/redux/time/util';

import { TimePart } from '../types';
import { maxDaysInMonth } from '../util';

import { MonthInput } from './MonthInput';
import { TimeIncrementInput } from './TimeIncrementInput';

export function TimeInput() {
  const [isLocked, setUseLock] = useState(false);
  const [pendingTime, setPendingTime] = useState(new Date());
  const [isHoldingShift, setIsHoldingShift] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const cappedTime = useAppSelector((state) => state.time.timeCapped);
  const backupTimeString = useAppSelector((state) => state.time.timeString);
  const luaApi = useOpenSpaceApi();
  const { setTime, interpolateTime } = useSetOpenSpaceTime();
  useSubscribeToTime();

  const cappedDate = new Date(cappedTime ?? '');
  const time = isLocked ? pendingTime : cappedDate;

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

    if (isLocked) {
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
        // fewer days. If the current day is 31 and the next month has only 30 (or fewer)
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

    if (isDateValid(newTime)) {
      setErrorMessage('');
    } else {
      setErrorMessage(
        'New date is outside range (April 20, 271821 BC, Sep 13, 275760 AD)'
      );
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
        // fewer days. If the current day is 31 and the next month has only 30 (or fewer)
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

    if (isDateValid(newTime)) {
      setErrorMessage('');
    } else {
      setErrorMessage(
        'New date is outside range (April 20, 271821 BC, Sep 13, 275760 AD)'
      );
    }

    updateTime({
      time: newTime,
      immediate: true,
      delta: 0, // This variable is not relevant in this case
      relative: false
    });
  }

  function onYearChange(value: number | string): void {
    // Mantine's NumberInput can return either a string or a number.
    // Since our wrapper does not handle string values, we ignore them.
    if (typeof value === 'string') {
      return;
    }

    // Validate the new date to ensure the year is within the valid JavaScript Date range
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
    const newTime = new Date(timeRef.current);
    newTime.setUTCFullYear(value);

    if (isDateValid(newTime)) {
      setErrorMessage('');
    } else {
      setErrorMessage(
        `Year '${value}' is outside allowed year range (April 20, 271821 BC, Sep 13, 275760 AD)`
      );
    }
  }

  if (cappedTime === undefined) {
    return (
      <Stack align={'center'} gap={2} pb={'xs'}>
        <Text>{backupTimeString}</Text>
        <Text c={'red'}>
          Can't interact with dates outside the range April 20, 271821 BC to Sep 13,
          275760 AD.
        </Text>
      </Stack>
    );
  }

  return (
    <Paper bg={'dark.9'} withBorder={isLocked} m={0} p={'xs'}>
      <Stack gap={'xs'}>
        <Group gap={'xs'} justify={'center'}>
          <Tooltip
            label={`Lock time updates to prevent automatic changes. Use "Interpolate" or "Set"
              to manually apply the selected date and time.`}
          >
            <ActionIcon
              onClick={toggleLock}
              variant={isLocked ? 'filled' : 'default'}
              aria-label={`Set date-time input mode to ${isLocked ? 'unlocked' : 'locked'} mode`}
            >
              {isLocked ? <LockIcon /> : <LockOpenIcon />}
            </ActionIcon>
          </Tooltip>
          <Group gap={5} wrap={'nowrap'}>
            <TimeIncrementInput
              value={time.getUTCFullYear()}
              onInputEnter={(value) => onTimeInput(TimePart.Years, value)}
              onInputChangeStep={(change) => onTimeInputRelative(TimePart.Years, change)}
              onInputChange={onYearChange}
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
              onInputChangeStep={(change) =>
                onTimeInputRelative(TimePart.Minutes, change)
              }
              min={0}
              max={60}
              w={40}
            />
            <TimeIncrementInput
              value={time.getUTCSeconds()}
              onInputEnter={(value) => onTimeInput(TimePart.Seconds, value)}
              onInputChangeStep={(change) =>
                onTimeInputRelative(TimePart.Seconds, change)
              }
              min={0}
              max={60}
              w={40}
            />
          </Group>
        </Group>
        {errorMessage && <Alert color={'red'}>{errorMessage}</Alert>}
        {isLocked && (
          <Group gap={'xs'} grow>
            <Button
              onClick={() => {
                interpolateToPendingTime();
                setUseLock(false);
              }}
              variant={'filled'}
            >
              Interpolate
            </Button>
            <Button
              onClick={() => {
                setToPendingTime();
                setUseLock(false);
              }}
              variant={'filled'}
            >
              Set
            </Button>
            <Button variant={'default'} onClick={() => setUseLock(false)}>
              Cancel
            </Button>
          </Group>
        )}
      </Stack>
    </Paper>
  );
}
