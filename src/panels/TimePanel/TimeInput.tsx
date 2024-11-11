import { useEffect, useRef, useState } from 'react';
import { ActionIcon, Button, Group } from '@mantine/core';

import { LockIcon, LockOpenIcon } from '@/icons/icons';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { subscribeToTime, unsubscribeToTime } from '@/redux/time/timeMiddleware';
import { isDateValid } from '@/redux/time/util';
import { TimePart } from '@/types/enums';

import { InlineInput } from './InlineInput';

export function TimeInput() {
  const [useLock, setUseLock] = useState(false);
  const [pendingTime, setPendingTime] = useState(new Date(''));

  const dispatch = useAppDispatch();
  const cappedTime = useAppSelector((state) => state.time.timeCapped);
  const luaApi = useAppSelector((state) => state.luaApi);

  const cappedDate = new Date(cappedTime ?? '');
  const time = useLock ? pendingTime : cappedDate;

  // TODO: anden88 2924-11-11: I'm not sure if I've dug myself in a trench here but using
  // a timeRef gives the correct dates when holding the plus/minus buttons, without it
  // the callback function used in `HoldableButton` will capture the time when we clicked
  // and any shift-action will not update beyond +- 1 from that captured value.
  const timeRef = useRef(time);

  useEffect(() => {
    timeRef.current = time;
  }, [time]);

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

  function setDate(newTime: Date) {
    // Spice, that is handling the time parsing in OpenSpace does not support
    // ISO 8601-style time zones (the Z). It does, however, always assume that UTC
    // is given.
    // For years > 10 000 the JSON string includes a '+' which mess up the OpenSpace
    // interpretation of the value so we remove it here. TODO: send milliseconds/seconds pls
    const fixedTimeString = newTime.toJSON().replace('Z', '').replace('+', '');
    // TODO: when we have negative years the date string must be formatted correctly for
    // OpenSpace to understand, haven't found a working string yet (anden88 2024-11-08),
    // its possible we must "reparse" the string back to B.C. YYYY MMM ...
    luaApi?.time.setTime(fixedTimeString);
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

    setDate(event.time);
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
      case TimePart.Date:
        if (relative) {
          newTime.setUTCDate(newTime.getUTCDate() + value);
        } else {
          newTime.setUTCDate(value);
        }
        break;
      case TimePart.Month:
        if (relative) {
          newTime.setUTCMonth(newTime.getUTCMonth() + value);
        } else {
          newTime.setUTCMonth(value);
        }
        break;
      case TimePart.Year:
        if (relative) {
          newTime.setUTCFullYear(newTime.getUTCFullYear() + value);
        } else {
          newTime.setUTCFullYear(value);
        }
        break;
      default:
        console.error("Unhandled 'TimePart' case", timePart);
        break;
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
    setDate(pendingTime);
    setUseLock(false);
  }
  function resetPendingTime() {
    setUseLock(false);
  }

  return (
    <>
      {cappedTime && time.toISOString()}
      {cappedTime ? (
        <Group gap={'lg'} mb={'xs'}>
          <ActionIcon onClick={toggleLock}>
            {useLock ? <LockIcon /> : <LockOpenIcon />}
          </ActionIcon>
          <Group gap={'xs'}>
            <InlineInput
              value={time.getUTCFullYear()}
              onInputChange={(value, relative, shiftKey) =>
                onInputChange(value, relative, shiftKey, TimePart.Year)
              }
              style={{ maxWidth: 100 }}
            />
            <InlineInput
              value={time.getUTCMonth()}
              onInputChange={(value, relative, shiftKey) =>
                onInputChange(value, relative, shiftKey, TimePart.Month)
              }
              style={{ maxWidth: 65 }}
            />
            <InlineInput
              value={time.getUTCDate()}
              onInputChange={(value, relative, shiftKey) =>
                onInputChange(value, relative, shiftKey, TimePart.Date)
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
              max={31}
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
      <p>TEMPORARY</p>
      <p>Current time: {cappedDate?.toUTCString()}</p>
      <p>Pending time: {pendingTime.toUTCString()}</p>
    </>
  );
}
