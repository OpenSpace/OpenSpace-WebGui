import { useTranslation } from 'react-i18next';

import { useSubscribeToTime } from '@/hooks/topicSubscriptions';

import { TaskCheckbox } from './Components/TaskCheckbox';
import { useTrackChange } from './hooks';

export function ChangeYearTask() {
  const { t } = useTranslation('panel-gettingstartedtour', { keyPrefix: 'tasks.year' });

  const now = useSubscribeToTime();
  const year = now && new Date(now).getUTCFullYear();

  const taskCompleted = useTrackChange(year);

  return <TaskCheckbox taskCompleted={taskCompleted} label={t('label')} />;
}
