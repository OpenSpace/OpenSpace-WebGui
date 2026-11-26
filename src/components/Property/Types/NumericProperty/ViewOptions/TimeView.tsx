import { useEffect, useRef, useState } from 'react';
import { DateTimePicker } from '@mantine/dates';

import { useOpenSpaceApi } from '@/api/hooks';
import { dateStringUTC, isDateValid } from '@/redux/time/util';
import { dateToOpenSpaceTimeString } from '@/util/time';

interface Props {
  value: number;
  setPropertyValue: (value: number) => void;
  readOnly: boolean;
}

// The picker works on 'YYYY-MM-DD HH:mm:ss' strings without a time zone, so we give it
// the UTC time as a string to avoid it being shifted to the local time zone
function toPickerValue(time: string): string {
  const date = new Date(dateStringUTC(time));
  if (!isDateValid(date)) {
    throw Error(`Could not parse time: ${time}`);
  }
  return date.toISOString().replace('T', ' ').replace('Z', '');
}

function toOpenSpaceValue(time: string): string {
  const match = time.match(/^([-+]?\d+)-(\d+)-(\d+) (\d+):(\d+):(\d+)(?:\.(\d+))?$/);
  if (!match) {
    throw Error(`Could not parse time: ${time}`);
  }
  const [year, month, day, hours, minutes, seconds, milliseconds = 0] = match
    .slice(1)
    .filter((part) => part !== undefined)
    .map(Number);

  const date = new Date(
    Date.UTC(2000, month - 1, day, hours, minutes, seconds, milliseconds)
  );
  // Set the year separately since Date.UTC maps the years 0-99 to 1900-1999
  date.setUTCFullYear(year);
  return dateToOpenSpaceTimeString(date);
}

export function TimeView({ value, setPropertyValue, readOnly }: Props) {
  const luaApi = useOpenSpaceApi();
  const requestId = useRef(0);
  const [timeValue, setTimeValue] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const request = ++requestId.current;

    if (!luaApi) {
      setTimeValue(null);
      return;
    }

    const api = luaApi;
    async function updateTimeValue() {
      try {
        const converted = await api.time.convertTime(value);
        if (request === requestId.current && typeof converted === 'string') {
          setTimeValue(toPickerValue(converted));
          setHasError(false);
        }
      } catch {
        if (request === requestId.current) {
          setHasError(true);
        }
      }
    }

    void updateTimeValue();
  }, [luaApi, value]);

  async function onTimeChange(newValue: string | null) {
    if (!luaApi || !newValue) {
      return;
    }

    const previousValue = timeValue;
    // The picker does not return milliseconds, so the milliseconds of the previous value
    // are kept to not lose them when the date or time is changed
    const milliseconds = previousValue?.match(/\.\d+$/)?.[0] ?? '';
    const newTimeValue = `${newValue}${milliseconds}`;
    const request = ++requestId.current;
    setTimeValue(newTimeValue);
    setHasError(false);

    try {
      const converted = await luaApi.time.convertTime(toOpenSpaceValue(newTimeValue));
      if (request !== requestId.current) {
        return;
      }
      if (typeof converted !== 'number') {
        throw Error('Time conversion did not return J2000 seconds');
      }
      setPropertyValue(converted);
    } catch {
      if (request === requestId.current) {
        setTimeValue(previousValue);
        setHasError(true);
      }
    }
  }

  return (
    <DateTimePicker
      value={timeValue}
      valueFormat={'YYYY-MM-DD HH:mm:ss.SSS [UTC]'}
      withSeconds
      clearable={false}
      disabled={readOnly || !luaApi || timeValue === null}
      error={hasError && 'Could not convert the time. Try a different date.'}
      onChange={onTimeChange}
      flex={1}
    />
  );
}
