import { Checkbox } from '@mantine/core';

import { useAppSelector } from '@/redux/hooks';

export function PauseTimeTask() {
  const isPaused = useAppSelector((state) => state.time.isPaused);

  const taskCompleted = isPaused === true;
  return (
    <Checkbox
      size={'lg'}
      c={'orange'}
      color={'green'}
      checked={taskCompleted}
      onChange={() => {}}
      label={`Task: Pause the time!`}
      style={{ cursor: 'default' }}
    />
  );
}
