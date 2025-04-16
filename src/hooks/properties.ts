import { useEffect } from 'react';
import { useThrottledCallback } from '@mantine/hooks';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  subscribeToProperty,
  unsubscribeToProperty
} from '@/redux/propertytree/properties/propertiesMiddleware';
import { setPropertyValue } from '@/redux/propertytree/properties/propertiesSlice';

import { PropertyOrPropertyGroup, PropertyTypeKey } from '../types/Property/property';
import { PropertyGroupsRuntime } from '../types/Property/propertyGroups';

function validatePropertyType<T>(
  type: T,
  prop: PropertyOrPropertyGroup<T> | undefined
): boolean {
  // Collect all the valid types - groups and specific property types
  const allowedTypes: string[] =
    typeof type === 'string' && type in PropertyGroupsRuntime
      ? Array.from(PropertyGroupsRuntime[type as keyof typeof PropertyGroupsRuntime])
      : [type as string];

  // Check if that is the case
  if (prop !== undefined && !allowedTypes.includes(prop.metaData.type)) {
    return false;
  }
  return true;
}

export function useProperty<T extends PropertyTypeKey>(
  type: T,
  uri: string
): [
  PropertyOrPropertyGroup<T>['value'] | undefined,
  (value: PropertyOrPropertyGroup<T>['value']) => void,
  PropertyOrPropertyGroup<T>['metaData'] | undefined
] {
  // Get the value from Redux
  const prop = useAppSelector((state) => state.properties.properties[uri]) as
    | PropertyOrPropertyGroup<T>
    | undefined;

  if (!validatePropertyType(type, prop)) {
    throw new Error(
      `Tried to access property with uri "${uri}" as type "${type}", but it is of type "${prop?.metaData.type}"`
    );
  }

  const dispatch = useAppDispatch();
  // Subscribe to the property
  const ThrottleMs = 1000 / 60;

  useEffect(() => {
    dispatch(subscribeToProperty({ uri }));
    return () => {
      dispatch(unsubscribeToProperty({ uri }));
    };
  }, [dispatch, uri]);

  const setValue = useThrottledCallback((value: PropertyOrPropertyGroup<T>['value']) => {
    dispatch(setPropertyValue({ uri, value }));
  }, ThrottleMs);

  return [prop?.value, setValue, prop?.metaData];
}
