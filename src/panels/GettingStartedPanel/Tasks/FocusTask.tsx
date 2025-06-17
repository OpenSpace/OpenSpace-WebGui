import { useTranslation } from 'react-i18next';

import { useProperty } from '@/hooks/properties';
import { useSceneGraphNode } from '@/hooks/propertyOwner';
import { NavigationAnchorKey } from '@/util/keys';

import { TaskCheckbox } from './Components/TaskCheckbox';

interface Props {
  anchor: string;
}

export function FocusTask({ anchor }: Props) {
  const [currentAnchor] = useProperty('StringProperty', NavigationAnchorKey);
  const anchorNode = useSceneGraphNode(anchor);

  const { t } = useTranslation('panel-gettingstartedtour', {
    keyPrefix: 'tasks.focus'
  });

  const taskCompleted =
    currentAnchor !== undefined && currentAnchor !== '' && currentAnchor === anchor;

  return (
    <TaskCheckbox
      taskCompleted={taskCompleted}
      label={t('label', { object: anchorNode?.name })}
    />
  );
}
