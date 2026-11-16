import { PropertyTypes, PropertyValue } from 'openspace-api-js/types';

import { usePropertyValue } from '@/hooks/properties';

import { TaskCheckbox } from './Components/TaskCheckbox';

interface Props<T extends PropertyTypes> {
  label: string;
  uri: string;
  propertyType: T;
  finalValue: PropertyValue<T>;
}

export function SetPropertyTask<T extends PropertyTypes>({
  label,
  uri,
  propertyType,
  finalValue
}: Props<T>) {
  const value = usePropertyValue(propertyType, uri);

  const taskCompleted = value === finalValue;

  return <TaskCheckbox taskCompleted={taskCompleted} label={label} />;
}
