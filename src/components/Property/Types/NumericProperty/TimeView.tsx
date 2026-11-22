import { useEffect, useRef, useState } from 'react';
import { DateTimePicker } from '@mantine/dates';

import { useOpenSpaceApi } from '@/api/hooks';

interface Props {
  value: number;
  setPropertyValue: (value: number) => void;
  readOnly: boolean;
}

function toPickerValue(time: string): string {
  return time.replace('T', ' ').replace(/\.\d+$/, '');
}

function toOpenSpaceValue(time: string): string {
  return time.replace(' ', 'T');
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
    const request = ++requestId.current;
    setTimeValue(newValue);
    setHasError(false);

    try {
      const converted = await luaApi.time.convertTime(toOpenSpaceValue(newValue));
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
      valueFormat={'YYYY-MM-DD HH:mm:ss [UTC]'}
      withSeconds
      clearable={false}
      disabled={readOnly || !luaApi || timeValue === null}
      error={hasError}
      onChange={onTimeChange}
      flex={1}
    />
  );
}
