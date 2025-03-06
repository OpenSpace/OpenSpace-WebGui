import { Checkbox } from '@mantine/core';

import { useSubscribeToTime } from '@/api/hooks';

import { useTrackChange } from './hooks';

export function ChangeYearTask() {
  const now = useSubscribeToTime();
  const year = now && new Date(now).getUTCFullYear();

  const taskCompleted = useTrackChange(year);
  return (
    <Checkbox
      size={'lg'}
      c={'orange'}
      color={'green'}
      checked={taskCompleted}
      onChange={() => {}}
      label={`Task: Change the year!`}
      style={{ cursor: 'default' }}
    />
  );
}
