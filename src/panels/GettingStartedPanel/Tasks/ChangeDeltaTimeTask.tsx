import { useTranslation } from 'react-i18next';

import { useAppSelector } from '@/redux/hooks';

import { TaskCheckbox } from './Components/TaskCheckbox';
import { useTrackChange } from './hooks';

export function ChangeDeltaTimeTask() {
  const deltaTime = useAppSelector((state) => state.time.deltaTime);
  const taskCompleted = useTrackChange(deltaTime);

  const { t } = useTranslation('panel-gettingstartedtour', {
    keyPrefix: 'tasks.delta-time'
  });

  return <TaskCheckbox taskCompleted={taskCompleted} label={t('label')} />;
}
