import { useEffect, useState } from 'react';

import { useOpenSpaceApi } from '@/api/hooks';
import { useAppSelector } from '@/redux/hooks';
import { ConnectionStatus } from '@/types/enums';
import { dateToOpenSpaceTimeString } from '@/util/time';

/**
 * Hook that listens to a prop and updates the local state when the prop changes.
 */
export function usePropListeningState<T>(prop: T) {
  const [value, setValue] = useState<T>(prop);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setValue(prop);
    }
  }, [prop, isEditing]);

  return { value, setValue, setIsEditing, isEditing: isEditing };
}

export function useIsConnectionStatus(status: ConnectionStatus): boolean {
  return useAppSelector((state) => state.connection.connectionStatus) === status;
}

export function useSetOpenSpaceTime() {
  const luaApi = useOpenSpaceApi();

  const setTime = (newTime: Date) => {
    const fixedTimeString = dateToOpenSpaceTimeString(newTime);
    luaApi?.time.setTime(fixedTimeString);
  };

  const interpolateTime = (newTime: Date) => {
    const fixedTimeString = dateToOpenSpaceTimeString(newTime);
    luaApi?.time.interpolateTime(fixedTimeString);
  };

  return { setTime, interpolateTime };
}
