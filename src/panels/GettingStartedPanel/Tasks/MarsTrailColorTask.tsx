import { Checkbox } from '@mantine/core';

import { useGetVec3PropertyValue } from '@/api/hooks';

import { useTrackChange } from './hooks';

export function MarsTrailColorTask() {
  const [color] = useGetVec3PropertyValue('Scene.MarsTrail.Renderable.Appearance.Color');

  const taskCompleted = useTrackChange(color);
  return (
    <Checkbox
      size={'lg'}
      c={'orange'}
      color={'green'}
      checked={taskCompleted}
      onChange={() => {}}
      label={`Task: Change the color of the trail of Mars!`}
      style={{ cursor: 'default' }}
    />
  );
}
