import { Checkbox } from '@mantine/core';

import { useAppSelector } from '@/redux/hooks';

import { useTrackChange } from './hooks';

export function ChangeDeltaTimeTask() {
  const deltaTime = useAppSelector((state) => state.time.deltaTime);
  const taskCompleted = useTrackChange(deltaTime);
  return (
    <Checkbox
      size={'lg'}
      c={'orange'}
      color={'green'}
      checked={taskCompleted}
      onChange={() => {}}
      label={`Task: Change the delta time!`}
      style={{ cursor: 'default' }}
    />
  );
}
