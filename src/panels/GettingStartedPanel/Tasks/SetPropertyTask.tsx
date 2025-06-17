import { useProperty } from '@/hooks/properties';
import { PropertyTypes } from '@/types/Property/propertyTypes';

import { TaskCheckbox } from './Components/TaskCheckbox';

interface Props<T extends keyof PropertyTypes> {
  label: string;
  uri: string;
  propertyType: T;
  finalValue: PropertyTypes[T]['value'];
}

export function SetPropertyTask<T extends keyof PropertyTypes>({
  label,
  uri,
  propertyType,
  finalValue
}: Props<T>) {
  const [value] = useProperty(propertyType, uri);

  const taskCompleted = value === finalValue;

  return <TaskCheckbox taskCompleted={taskCompleted} label={label} />;
}
