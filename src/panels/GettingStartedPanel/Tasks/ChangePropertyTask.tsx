import { TaskCheckbox } from './Components/TaskCheckbox';
import { useProperty } from '@/hooks/properties';

interface Props {
  uri: string;
  finalValue: boolean;
  label: string;
}

export function SetBoolPropertyTask({ label, uri, finalValue }: Props) {
  const [value] = useProperty('BoolProperty', uri);

  const taskCompleted = value === finalValue;

  return <TaskCheckbox taskCompleted={taskCompleted} label={label} />;
}
