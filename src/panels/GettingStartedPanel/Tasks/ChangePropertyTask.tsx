import { usePropertyValue } from '@/hooks/properties';
import { PropertyTypeKey } from '@/types/Property/property';

import { TaskCheckbox } from './Components/TaskCheckbox';
import { useTrackChange } from './hooks';

interface Props {
  label: string;
  uri: string;
  propertyType: PropertyTypeKey;
}

export function ChangePropertyTask({ label, uri, propertyType }: Props) {
  const value = usePropertyValue(propertyType, uri);

  const taskCompleted = useTrackChange(value);

  return <TaskCheckbox taskCompleted={taskCompleted} label={label} />;
}
