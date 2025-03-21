import { useEffect } from 'react';
import { useThrottledCallback } from '@mantine/hooks';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  subscribeToProperty,
  unsubscribeToProperty
} from '@/redux/propertytree/properties/propertiesMiddleware';
import { setPropertyValue } from '@/redux/propertytree/properties/propertiesSlice';
import { PropertyDetails, PropertyValue, Uri } from '@/types/types';

// Since trigger properties are different than the rest, they don't actually
// have a value. Only returning the trigger function
export const useTriggerProperty = (uri: Uri) => {
  const dispatch = useAppDispatch();
  // Set function to mimic useState
  function trigger() {
    dispatch(setPropertyValue({ uri: uri, value: null }));
  }

  return trigger;
};

export function useGetPropertyDescription(uri: Uri): PropertyDetails | undefined {
  return useAppSelector((state) => state.properties.properties[uri]?.description);
}

// TODO: rename all these functions to just use - now its a get / set function
function useProperty<T>(
  uri: Uri,
  propertyType: string | string[]
): [T | undefined, (value: T) => void] {
  const dispatch = useAppDispatch();
  // Throttle limit
  const ThrottleMs = 1000 / 60;

  // Get value from Redux
  const value = useAppSelector((state) => {
    const prop = state.properties.properties[uri];
    // Validate the props type
    if (prop) {
      if (Array.isArray(propertyType) && !propertyType.includes(prop.description.type)) {
        throw Error(
          `Requested one of the following properties: ${propertyType.join(', ')} but got a ${prop.description.type}`
        );
      } else if (
        typeof propertyType === 'string' &&
        prop.description.type !== propertyType
      ) {
        throw Error(`Requested a ${propertyType} but got a ${prop.description.type}`);
      }
    }
    return prop?.value;
  }) as T | undefined;

  // Every time we want a property value we also want to make sure we get the
  // updated value. Hence we subscribe
  useEffect(() => {
    dispatch(subscribeToProperty({ uri: uri }));
    return () => {
      dispatch(unsubscribeToProperty({ uri: uri }));
    };
  }, [dispatch, uri]);

  // Set function to mimic useState
  const setValue = useThrottledCallback((value: T) => {
    dispatch(setPropertyValue({ uri: uri, value: value as PropertyValue }));
  }, ThrottleMs);

  return [value, setValue];
}

export const useGetBoolPropertyValue = (uri: Uri) =>
  useProperty<boolean>(uri, 'BoolProperty');

export const useGetStringPropertyValue = (uri: Uri) =>
  useProperty<string>(uri, 'StringProperty');

export const useGetSelectionPropertyValue = (uri: Uri) =>
  useProperty<string[]>(uri, 'SelectionProperty');

export const useGetOptionPropertyValue = (uri: Uri) =>
  useProperty<number>(uri, 'OptionProperty');

// Vectors
export const useGetDVec2PropertyValue = (uri: Uri) =>
  useProperty<number[]>(uri, 'DVec2Property');

export const useGetDVec3PropertyValue = (uri: Uri) =>
  useProperty<number[]>(uri, 'DVec3Property');

export const useGetDVec4PropertyValue = (uri: Uri) =>
  useProperty<number[]>(uri, 'DVec4Property');

export const useGetIVec2PropertyValue = (uri: Uri) =>
  useProperty<number[]>(uri, 'IVec2Property');
// Vectors
export const useGetIVec3PropertyValue = (uri: Uri) =>
  useProperty<number[]>(uri, 'IVec3Property');

export const useGetIVec4PropertyValue = (uri: Uri) =>
  useProperty<number[]>(uri, 'IVec4Property');

export const useGetUVec2PropertyValue = (uri: Uri) =>
  useProperty<number[]>(uri, 'UVec2Property');

export const useGetUVec3PropertyValue = (uri: Uri) =>
  useProperty<number[]>(uri, 'UVec3Property');

export const useGetUVec4PropertyValue = (uri: Uri) =>
  useProperty<number[]>(uri, 'UVec4Property');

export const useGetVec2PropertyValue = (uri: Uri) =>
  useProperty<number[]>(uri, 'Vec2Property');

export const useGetVec3PropertyValue = (uri: Uri) =>
  useProperty<number[]>(uri, 'Vec3Property');

export const useGetVec4PropertyValue = (uri: Uri) =>
  useProperty<number[]>(uri, 'Vec4Property');

// Scalars
export const useGetDoublePropertyValue = (uri: Uri) =>
  useProperty<number>(uri, 'DoubleProperty');

export const useGetFloatPropertyValue = (uri: Uri) =>
  useProperty<number>(uri, 'FloatProperty');

export const useGetIntPropertyValue = (uri: Uri) =>
  useProperty<number>(uri, 'IntProperty');

export const useGetLongPropertyValue = (uri: Uri) =>
  useProperty<number>(uri, 'LongProperty');

export const useGetShortPropertyValue = (uri: Uri) =>
  useProperty<number>(uri, 'ShortProperty');

export const useGetUIntPropertyValue = (uri: Uri) =>
  useProperty<number>(uri, 'UIntProperty');

export const useGetULongPropertyValue = (uri: Uri) =>
  useProperty<number>(uri, 'ULongProperty');

export const useGetUShortPropertyValue = (uri: Uri) =>
  useProperty<number>(uri, 'UShortProperty');

// Matrices
export const useGetDMat2PropertyValue = (uri: Uri) =>
  useProperty<number[]>(uri, 'DMat2Property');

export const useGetDMat3PropertyValue = (uri: Uri) =>
  useProperty<number[]>(uri, 'DMat3Property');

export const useGetDMat4PropertyValue = (uri: Uri) =>
  useProperty<number[]>(uri, 'DMat4Property');

export const useGetMat2PropertyValue = (uri: Uri) =>
  useProperty<number[]>(uri, 'Mat2Property');

export const useGetMat3PropertyValue = (uri: Uri) =>
  useProperty<number[]>(uri, 'Mat3Property');

export const useGetMat4PropertyValue = (uri: Uri) =>
  useProperty<number[]>(uri, 'Mat4Property');

// Lists
export const useGetDoubleListPropertyValue = (uri: Uri) =>
  useProperty<number[]>(uri, 'DoubleListProperty');

export const useGetIntListPropertyValue = (uri: Uri) =>
  useProperty<number[]>(uri, 'IntListProperty');

export const useGetStringListPropertyValue = (uri: Uri) =>
  useProperty<string[]>(uri, 'StringListProperty');

// Generic properties
// IMPORTANT: These should not be used other than in the generic property component!!
export const useGetGenericVectorPropertyValue = (uri: Uri) =>
  useProperty<number[]>(uri, [
    'Vec2Property',
    'Vec3Property',
    'Vec4Property',
    'DVec2Property',
    'DVec3Property',
    'DVec4Property',
    'IVec2Property',
    'IVec3Property',
    'IVec4Property',
    'UVec2Property',
    'UVec3Property',
    'UVec4Property'
  ]);

export const useGetGenericMatrixPropertyValue = (uri: Uri) =>
  useProperty<number[]>(uri, [
    'Mat2Property',
    'Mat3Property',
    'Mat4Property',
    'DMat2Property',
    'DMat3Property',
    'DMat4Property'
  ]);

export const useGetGenericNumericPropertyValue = (uri: Uri) =>
  useProperty<number>(uri, [
    'FloatProperty',
    'DoubleProperty',
    'ShortProperty',
    'UShortProperty',
    'LongProperty',
    'ULongProperty',
    'IntProperty',
    'UIntProperty'
  ]);
