import { useGetBoolPropertyValue } from '@/api/hooks';

import { TaskCheckbox } from './Components/TaskCheckbox';

interface Props {
  uri: string;
  finalValue: boolean;
  label: string;
}

export function SetBoolPropertyTask({ label, uri, finalValue }: Props) {
  const [value] = useGetBoolPropertyValue(uri);

  const taskCompleted = value === finalValue;

  return <TaskCheckbox taskCompleted={taskCompleted} label={label} />;
}
