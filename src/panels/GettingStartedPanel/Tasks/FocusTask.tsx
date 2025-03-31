import { useStringProperty } from '@/hooks/properties';
import { NavigationAnchorKey } from '@/util/keys';

import { TaskCheckbox } from './Components/TaskCheckbox';

interface Props {
  anchor: string;
}

export function FocusTask({ anchor }: Props) {
  const [currentAnchor] = useStringProperty(NavigationAnchorKey);
  const taskCompleted =
    currentAnchor !== undefined && currentAnchor !== '' && currentAnchor === anchor;

  return <TaskCheckbox taskCompleted={taskCompleted} label={`Focus on ${anchor}`} />;
}
