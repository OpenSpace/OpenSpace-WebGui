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

export function usePropertyDescription(uri: Uri): PropertyDetails | undefined {
  return useAppSelector((state) => state.properties.properties[uri]?.description);
}

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

export const useBoolProperty = (uri: Uri) => useProperty<boolean>(uri, 'BoolProperty');

export const useStringProperty = (uri: Uri) => useProperty<string>(uri, 'StringProperty');

export const useSelectionProperty = (uri: Uri) =>
  useProperty<string[]>(uri, 'SelectionProperty');

export const useOptionProperty = (uri: Uri) => useProperty<number>(uri, 'OptionProperty');

// Vectors
export const useDVec2Property = (uri: Uri) => useProperty<number[]>(uri, 'DVec2Property');

export const useDVec3Property = (uri: Uri) => useProperty<number[]>(uri, 'DVec3Property');

export const useDVec4Property = (uri: Uri) => useProperty<number[]>(uri, 'DVec4Property');

export const useIVec2Property = (uri: Uri) => useProperty<number[]>(uri, 'IVec2Property');
// Vectors
export const useIVec3Property = (uri: Uri) => useProperty<number[]>(uri, 'IVec3Property');

export const useIVec4Property = (uri: Uri) => useProperty<number[]>(uri, 'IVec4Property');

export const useUVec2Property = (uri: Uri) => useProperty<number[]>(uri, 'UVec2Property');

export const useUVec3Property = (uri: Uri) => useProperty<number[]>(uri, 'UVec3Property');

export const useUVec4Property = (uri: Uri) => useProperty<number[]>(uri, 'UVec4Property');

export const useVec2Property = (uri: Uri) => useProperty<number[]>(uri, 'Vec2Property');

export const useVec3Property = (uri: Uri) => useProperty<number[]>(uri, 'Vec3Property');

export const useVec4Property = (uri: Uri) => useProperty<number[]>(uri, 'Vec4Property');

// Scalars
export const useDoubleProperty = (uri: Uri) => useProperty<number>(uri, 'DoubleProperty');

export const useFloatProperty = (uri: Uri) => useProperty<number>(uri, 'FloatProperty');

export const useIntProperty = (uri: Uri) => useProperty<number>(uri, 'IntProperty');

export const useLongProperty = (uri: Uri) => useProperty<number>(uri, 'LongProperty');

export const useShortProperty = (uri: Uri) => useProperty<number>(uri, 'ShortProperty');

export const useUIntProperty = (uri: Uri) => useProperty<number>(uri, 'UIntProperty');

export const useULongProperty = (uri: Uri) => useProperty<number>(uri, 'ULongProperty');

export const useUShortProperty = (uri: Uri) => useProperty<number>(uri, 'UShortProperty');

// Matrices
export const useDMat2Property = (uri: Uri) => useProperty<number[]>(uri, 'DMat2Property');

export const useDMat3Property = (uri: Uri) => useProperty<number[]>(uri, 'DMat3Property');

export const useDMat4Property = (uri: Uri) => useProperty<number[]>(uri, 'DMat4Property');

export const useMat2Property = (uri: Uri) => useProperty<number[]>(uri, 'Mat2Property');

export const useMat3Property = (uri: Uri) => useProperty<number[]>(uri, 'Mat3Property');

export const useMat4Property = (uri: Uri) => useProperty<number[]>(uri, 'Mat4Property');

// Lists
export const useDoubleListProperty = (uri: Uri) =>
  useProperty<number[]>(uri, 'DoubleListProperty');

export const useIntListProperty = (uri: Uri) =>
  useProperty<number[]>(uri, 'IntListProperty');

export const useStringListProperty = (uri: Uri) =>
  useProperty<string[]>(uri, 'StringListProperty');

// Generic properties
// IMPORTANT: These should not be used other than in the generic property component!!
export const useGenericVectorProperty = (uri: Uri) =>
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

export const useGenericMatrixProperty = (uri: Uri) =>
  useProperty<number[]>(uri, [
    'Mat2Property',
    'Mat3Property',
    'Mat4Property',
    'DMat2Property',
    'DMat3Property',
    'DMat4Property'
  ]);

export const useGenericNumericProperty = (uri: Uri) =>
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
