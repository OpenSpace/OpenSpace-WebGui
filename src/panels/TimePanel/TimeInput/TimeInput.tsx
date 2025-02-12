import { useEffect, useRef, useState } from 'react';
import { ActionIcon, Button, Center, Group, Stack, Text } from '@mantine/core';
import { useWindowEvent } from '@mantine/hooks';

import { useOpenSpaceApi } from '@/api/hooks';
import { LockIcon, LockOpenIcon } from '@/icons/icons';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { subscribeToTime, unsubscribeToTime } from '@/redux/time/timeMiddleware';
import { isDateValid } from '@/redux/time/util';
import { TimePart } from '@/types/enums';

import { setDate } from '../util';

import { MonthInput } from './MonthInput';
import { TimeIncrementInput } from './TimeIncrementInput';

export function TimeInput() {
  const [useLock, setUseLock] = useState(false);
  const [pendingTime, setPendingTime] = useState(new Date(''));
  const [isHoldingShift, setIsHoldingShift] = useState(false);

  const dispatch = useAppDispatch();
  const cappedTime = useAppSelector((state) => state.time.timeCapped);
  const luaApi = useOpenSpaceApi();

  const cappedDate = new Date(cappedTime ?? '');
  const time = useLock ? pendingTime : cappedDate;

  // @TODO (2025-02-12, emmbr) is this ref really recessary?
  // To avoid stale state and javascript capture magic, we need to set the time
  // to a ref so we can use the latest time in the functions in the component
  const timeRef = useRef(time);
  timeRef.current = time;

  useEffect(() => {
    dispatch(subscribeToTime());

    return () => {
      dispatch(unsubscribeToTime());
    };
  }, [dispatch]);

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

  function interpolateDateRelative(delta: number) {
    luaApi?.time.interpolateTimeRelative(delta);
  }

  function interpolateDate(newTime: Date) {
    const fixedTimeString = newTime.toJSON().replace('Z', '');
    luaApi?.time.interpolateTime(fixedTimeString);
  }

  function changeDate(event: {
    time: Date;
    immediate: boolean; // If not, interpolate
    delta: number;
    relative: boolean;
  }) {
    if (useLock) {
      setPendingTime(event.time);
      return;
    }

    if (event.immediate) {
      setDate(luaApi, event.time);
      return;
    }

    if (event.relative) {
      interpolateDateRelative(event.delta);
    } else {
      interpolateDate(event.time);
    }
  }

  function updateTime(timePart: TimePart, value: number, relative: boolean) {
    const newTime = new Date(timeRef.current);
    switch (timePart) {
      case TimePart.Milliseconds:
        if (relative) {
          newTime.setUTCMilliseconds(newTime.getUTCMilliseconds() + value);
        } else {
          newTime.setUTCMilliseconds(value);
        }
        break;
      case TimePart.Seconds:
        if (relative) {
          newTime.setUTCSeconds(newTime.getUTCSeconds() + value);
        } else {
          newTime.setUTCSeconds(value);
        }
        break;
      case TimePart.Minutes:
        if (relative) {
          newTime.setUTCMinutes(newTime.getUTCMinutes() + value);
        } else {
          newTime.setUTCMinutes(value);
        }
        break;
      case TimePart.Hours:
        if (relative) {
          newTime.setUTCHours(newTime.getUTCHours() + value);
        } else {
          newTime.setUTCHours(value);
        }
        break;
      case TimePart.Days:
        if (relative) {
          newTime.setUTCDate(newTime.getUTCDate() + value);
        } else {
          newTime.setUTCDate(value);
        }
        break;
      case TimePart.Months:
        if (relative) {
          newTime.setUTCMonth(newTime.getUTCMonth() + value);
        } else {
          newTime.setUTCMonth(value);
        }
        break;
      case TimePart.Years:
        if (relative) {
          newTime.setUTCFullYear(newTime.getUTCFullYear() + value);
        } else {
          newTime.setUTCFullYear(value);
        }
        break;
      default:
        throw Error(`Unhandled 'TimePart' case: ${timePart}`);
    }
    return newTime;
  }

  function onInputChange(
    value: number,
    relative: boolean,
    immediate: boolean,
    timePart: TimePart
  ) {
    const newTime = updateTime(timePart, value, relative);

    if (!isDateValid(newTime)) {
      return;
    }

    changeDate({
      time: newTime,
      immediate: immediate ?? isHoldingShift,
      delta: (newTime.getTime() - timeRef.current.getTime()) / 1000,
      relative
    });
  }

  function interpolateToPendingTime() {
    interpolateDate(pendingTime);
    setUseLock(false);
  }

  function setToPendingTime() {
    setDate(luaApi, pendingTime);
    setUseLock(false);
  }
  function resetPendingTime() {
    setUseLock(false);
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
            onInputChange={(value) => onInputChange(value, false, true, TimePart.Years)}
            onInputChangeStep={(change) =>
              onInputChange(change, true, isHoldingShift, TimePart.Years)
            }
            w={65}
          />
          <MonthInput
            month={time.getUTCMonth()}
            onInputChange={(value) => onInputChange(value, false, true, TimePart.Months)}
            onInputChangeStep={(change) =>
              onInputChange(change, true, isHoldingShift, TimePart.Months)
            }
            w={55}
          />

          <TimeIncrementInput
            value={time.getUTCDate()}
            onInputChange={(value) => onInputChange(value, false, true, TimePart.Days)}
            onInputChangeStep={(change) =>
              onInputChange(change, true, isHoldingShift, TimePart.Days)
            }
            min={1}
            max={31}
            w={40}
          />
        </Group>
        <Group gap={5} wrap={'nowrap'}>
          <TimeIncrementInput
            value={time.getUTCHours()}
            onInputChange={(value) => onInputChange(value, false, true, TimePart.Hours)}
            onInputChangeStep={(change) =>
              onInputChange(change, true, isHoldingShift, TimePart.Hours)
            }
            min={0}
            max={24}
            w={40}
          />
          <TimeIncrementInput
            value={time.getUTCMinutes()}
            onInputChange={(value) => onInputChange(value, false, true, TimePart.Minutes)}
            onInputChangeStep={(change) =>
              onInputChange(change, true, isHoldingShift, TimePart.Minutes)
            }
            min={0}
            max={60}
            w={40}
          />
          <TimeIncrementInput
            value={time.getUTCSeconds()}
            onInputChange={(value) => onInputChange(value, false, true, TimePart.Seconds)}
            onInputChangeStep={(change) =>
              onInputChange(change, true, isHoldingShift, TimePart.Seconds)
            }
            min={0}
            max={60}
            w={40}
          />
        </Group>
      </Group>
      {useLock && (
        <Group gap={'xs'} grow>
          <Button onClick={interpolateToPendingTime}>Interpolate</Button>
          <Button onClick={setToPendingTime}>Set</Button>
          <Button variant={'outline'} onClick={resetPendingTime}>
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
