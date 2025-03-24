import { useBoolProperty } from '@/hooks/properties';

import { TaskCheckbox } from './Components/TaskCheckbox';

interface Props {
  uri: string;
  finalValue: boolean;
  label: string;
}

export function SetBoolPropertyTask({ label, uri, finalValue }: Props) {
  const [value] = useBoolProperty(uri);

  const taskCompleted = value === finalValue;

  return <TaskCheckbox taskCompleted={taskCompleted} label={label} />;
}
