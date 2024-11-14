import { useEffect, useRef, useState } from 'react';
import { ActionIcon, Button, Group } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { LockIcon, LockOpenIcon } from '@/icons/icons';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { subscribeToTime, unsubscribeToTime } from '@/redux/time/timeMiddleware';
import { isDateValid } from '@/redux/time/util';
import { TimePart } from '@/types/enums';

import { InlineInput } from './InlineInput';
import { MonthInput } from './MonthInput';
import { setDate } from './util';

export function TimeInput() {
  const [useLock, setUseLock] = useState(false);
  const [pendingTime, setPendingTime] = useState(new Date(''));

  const dispatch = useAppDispatch();
  const cappedTime = useAppSelector((state) => state.time.timeCapped);
  const luaApi = useOpenSpaceApi();

  const cappedDate = new Date(cappedTime ?? '');
  const time = useLock ? pendingTime : cappedDate;

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
    interpolate: boolean;
    delta: number;
    relative: boolean;
  }) {
    if (useLock) {
      setPendingTime(event.time);
      return;
    }

    if (event.interpolate) {
      if (event.relative) {
        interpolateDateRelative(event.delta);
      } else {
        interpolateDate(event.time);
      }
      return;
    }

    setDate(luaApi, event.time);
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
    interpolate: boolean,
    timePart: TimePart
  ) {
    const newTime = updateTime(timePart, value, relative);

    if (!isDateValid(newTime)) {
      return;
    }

    changeDate({
      time: newTime,
      interpolate: interpolate,
      delta: (newTime.getTime() - timeRef.current.getTime()) / 1000,
      relative: relative
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

  return (
    <>
      {cappedTime ? (
        <Group gap={'lg'} mb={'xs'}>
          <ActionIcon onClick={toggleLock}>
            {useLock ? <LockIcon /> : <LockOpenIcon />}
          </ActionIcon>
          <Group gap={'xs'}>
            <InlineInput
              value={time.getUTCFullYear()}
              onInputChange={(value, relative, shiftKey) =>
                onInputChange(value, relative, shiftKey, TimePart.Years)
              }
              style={{ maxWidth: 100 }}
            />
            <MonthInput
              month={time.getUTCMonth()}
              onInputChange={(value, relative, shiftKey) =>
                onInputChange(value, relative, shiftKey, TimePart.Months)
              }
              style={{ maxWidth: 75 }}
            />

            <InlineInput
              value={time.getUTCDate()}
              onInputChange={(value, relative, shiftKey) =>
                onInputChange(value, relative, shiftKey, TimePart.Days)
              }
              min={0}
              max={31}
              style={{ maxWidth: 65 }}
            />
          </Group>
          <Group gap={'xs'}>
            <InlineInput
              value={time.getUTCHours()}
              onInputChange={(value, relative, shiftKey) =>
                onInputChange(value, relative, shiftKey, TimePart.Hours)
              }
              min={0}
              max={24}
              style={{ maxWidth: 65 }}
            />
            <InlineInput
              value={time.getUTCMinutes()}
              onInputChange={(value, relative, shiftKey) =>
                onInputChange(value, relative, shiftKey, TimePart.Minutes)
              }
              min={0}
              max={60}
              style={{ maxWidth: 65 }}
            />
            <InlineInput
              value={time.getUTCSeconds()}
              onInputChange={(value, relative, shiftKey) =>
                onInputChange(value, relative, shiftKey, TimePart.Seconds)
              }
              min={0}
              max={60}
              style={{ maxWidth: 65 }}
            />
          </Group>
        </Group>
      ) : (
        <h2>Date out of range</h2>
      )}
      {useLock && (
        <Group gap={'xs'} grow>
          <Button onClick={interpolateToPendingTime}>Interpolate</Button>
          <Button onClick={setToPendingTime}>Set</Button>
          <Button onClick={resetPendingTime}>Cancel</Button>
        </Group>
      )}
    </>
  );
}
