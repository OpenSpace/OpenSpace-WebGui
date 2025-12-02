import { useTranslation } from 'react-i18next';

import { useAppSelector } from '@/redux/hooks';

import { TaskCheckbox } from './Components/TaskCheckbox';

export function PauseTimeTask() {
  const { t } = useTranslation('panel-gettingstartedtour', {
    keyPrefix: 'tasks.pause-time'
  });

  const isPaused = useAppSelector((state) => state.time.isPaused);
  const taskCompleted = isPaused === true;

  return <TaskCheckbox taskCompleted={taskCompleted} label={t('label')} />;
}
