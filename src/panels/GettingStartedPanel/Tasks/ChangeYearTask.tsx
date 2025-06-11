import { useTranslation } from 'react-i18next';

import { useSubscribeToTime } from '@/hooks/topicSubscriptions';

import { TaskCheckbox } from './Components/TaskCheckbox';
import { useTrackChange } from './hooks';

export function ChangeYearTask() {
  const now = useSubscribeToTime();
  const year = now && new Date(now).getUTCFullYear();

  const taskCompleted = useTrackChange(year);

  const { t } = useTranslation('panel-gettingstartedtour', {
    keyPrefix: 'tasks.year'
  });

  return <TaskCheckbox taskCompleted={taskCompleted} label={t('label')} />;
}
