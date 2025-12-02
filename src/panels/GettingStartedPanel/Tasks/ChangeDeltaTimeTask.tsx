import { useTranslation } from 'react-i18next';

import { useAppSelector } from '@/redux/hooks';

import { TaskCheckbox } from './Components/TaskCheckbox';
import { useTrackChange } from './hooks';

export function ChangeDeltaTimeTask() {
  const { t } = useTranslation('panel-gettingstartedtour', {
    keyPrefix: 'tasks.delta-time'
  });

  const deltaTime = useAppSelector((state) => state.time.deltaTime);
  const taskCompleted = useTrackChange(deltaTime);

  return <TaskCheckbox taskCompleted={taskCompleted} label={t('label')} />;
}
