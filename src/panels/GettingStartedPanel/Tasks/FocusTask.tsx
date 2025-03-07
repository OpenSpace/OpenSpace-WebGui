import { Checkbox } from '@mantine/core';

import { useGetStringPropertyValue } from '@/api/hooks';
import { NavigationAnchorKey } from '@/util/keys';

interface Props {
  anchor: string;
}

export function FocusTask({ anchor }: Props) {
  const [currentAnchor] = useGetStringPropertyValue(NavigationAnchorKey);
  const taskCompleted =
    currentAnchor !== undefined && currentAnchor !== '' && currentAnchor === anchor;

  return (
    <Checkbox
      size={'lg'}
      c={'orange'}
      color={'green'}
      checked={taskCompleted}
      onChange={() => {}}
      label={`Task: Focus on ${anchor}!`}
      style={{ cursor: 'default' }}
    />
  );
}
