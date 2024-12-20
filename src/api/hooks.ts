import { useContext, useEffect } from 'react';
import { useThrottledCallback } from '@mantine/hooks';
import { throttle } from 'lodash';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  subscribeToProperty,
  unsubscribeToProperty
} from '@/redux/propertytree/properties/propertiesMiddleware';
import { setPropertyValue } from '@/redux/propertytree/properties/propertiesSlice';
import { Property, PropertyOwner, PropertyValue, Uri } from '@/types/types';

import { LuaApiContext } from './LuaApiContext';
// Hook to make it easier to get the api
export function useOpenSpaceApi() {
  const api = useContext(LuaApiContext);
  return api;
}

export function useGetPropertyOwner(uri: Uri): PropertyOwner | undefined {
  return useAppSelector((state) => state.propertyOwners.propertyOwners[uri]);
}

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

export function useGetProperty(uri: Uri): Property | undefined {
  return useAppSelector((state) => state.properties.properties[uri]);
}

// TODO: rename all these functions to just use - now its a get / set function
function useGetPropertyValue<T>(
  uri: Uri,
  propertyType: string
): [T | undefined, (value: T) => void] {
  const dispatch = useAppDispatch();
  // Throttle limit
  const ThrottleMs = 1000 / 60;

  // Get value from Redux
  const value = useAppSelector((state) => {
    const prop = state.properties.properties[uri];
    if (prop && prop?.description.type !== propertyType) {
      throw Error(`Requested a ${propertyType} but got a ${prop.description.type}`);
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
  function setValue(value: T) {
    dispatch(setPropertyValue({ uri: uri, value: value as PropertyValue }));
  }

  return [value, throttle(setValue, ThrottleMs)];
}

export const useGetBoolPropertyValue = (uri: Uri) =>
  useGetPropertyValue<boolean>(uri, 'BoolProperty');

export const useGetStringPropertyValue = (uri: Uri) =>
  useGetPropertyValue<string>(uri, 'StringProperty');

export const useGetSelectionPropertyValue = (uri: Uri) =>
  useGetPropertyValue<number>(uri, 'SelectionProperty');

export const useGetOptionPropertyValue = (uri: Uri) =>
  useGetPropertyValue<number>(uri, 'OptionProperty');

// Vectors
export const useGetDVec2PropertyValue = (uri: Uri) =>
  useGetPropertyValue<number[]>(uri, 'DVec2Property');

export const useGetDVec3PropertyValue = (uri: Uri) =>
  useGetPropertyValue<number[]>(uri, 'DVec3Property');

export const useGetDVec4PropertyValue = (uri: Uri) =>
  useGetPropertyValue<number[]>(uri, 'DVec4Property');

export const useGetIVec2PropertyValue = (uri: Uri) =>
  useGetPropertyValue<number[]>(uri, 'IVec2Property');
// Vectors
export const useGetIVec3PropertyValue = (uri: Uri) =>
  useGetPropertyValue<number[]>(uri, 'IVec3Property');

export const useGetIVec4PropertyValue = (uri: Uri) =>
  useGetPropertyValue<number[]>(uri, 'IVec4Property');

export const useGetUVec2PropertyValue = (uri: Uri) =>
  useGetPropertyValue<number[]>(uri, 'UVec2Property');

export const useGetUVec3PropertyValue = (uri: Uri) =>
  useGetPropertyValue<number[]>(uri, 'UVec3Property');

export const useGetUVec4PropertyValue = (uri: Uri) =>
  useGetPropertyValue<number[]>(uri, 'UVec4Property');

export const useGetVec2PropertyValue = (uri: Uri) =>
  useGetPropertyValue<number[]>(uri, 'Vec2Property');

export const useGetVec3PropertyValue = (uri: Uri) =>
  useGetPropertyValue<number[]>(uri, 'Vec3Property');

export const useGetVec4PropertyValue = (uri: Uri) =>
  useGetPropertyValue<number[]>(uri, 'Vec4Property');

// Scalars
export const useGetDoublePropertyValue = (uri: Uri) =>
  useGetPropertyValue<number>(uri, 'DoubleProperty');

export const useGetFloatPropertyValue = (uri: Uri) =>
  useGetPropertyValue<number>(uri, 'FloatProperty');

export const useGetIntPropertyValue = (uri: Uri) =>
  useGetPropertyValue<number>(uri, 'IntProperty');

export const useGetLongPropertyValue = (uri: Uri) =>
  useGetPropertyValue<number>(uri, 'LongProperty');

export const useGetShortPropertyValue = (uri: Uri) =>
  useGetPropertyValue<number>(uri, 'ShortProperty');

export const useGetUIntPropertyValue = (uri: Uri) =>
  useGetPropertyValue<number>(uri, 'UIntProperty');

export const useGetULongPropertyValue = (uri: Uri) =>
  useGetPropertyValue<number>(uri, 'ULongProperty');

export const useGetUShortPropertyValue = (uri: Uri) =>
  useGetPropertyValue<number>(uri, 'UShortProperty');

// Matrices
export const useGetDMat2PropertyValue = (uri: Uri) =>
  useGetPropertyValue<number[]>(uri, 'DMat2Property');

export const useGetDMat3PropertyValue = (uri: Uri) =>
  useGetPropertyValue<number[]>(uri, 'DMat3Property');

export const useGetDMat4PropertyValue = (uri: Uri) =>
  useGetPropertyValue<number[]>(uri, 'DMat4Property');

export const useGetMat2PropertyValue = (uri: Uri) =>
  useGetPropertyValue<number[]>(uri, 'Mat2Property');

export const useGetMat3PropertyValue = (uri: Uri) =>
  useGetPropertyValue<number[]>(uri, 'Mat3Property');

export const useGetMat4PropertyValue = (uri: Uri) =>
  useGetPropertyValue<number[]>(uri, 'Mat4Property');

// Lists
export const useGetDoubleListPropertyValue = (uri: Uri) =>
  useGetPropertyValue<number[]>(uri, 'DoubleListProperty');

export const useGetIntListPropertyValue = (uri: Uri) =>
  useGetPropertyValue<number[]>(uri, 'IntListProperty');

export const useGetStringListPropertyValue = (uri: Uri) =>
  useGetPropertyValue<string[]>(uri, 'StringListProperty');

/**
 * Hook that subscribes to a property and returns a setter function. Unsuscribes when the
 * component is unmounted.
 */
export const useSubscribeToProperty = (uri: Uri) => {
  const ThrottleMs = 1000 / 60;
  const dispatch = useAppDispatch();
  const setFunc = useThrottledCallback((value: PropertyValue) => {
    dispatch(setPropertyValue({ uri: uri, value: value }));
  }, ThrottleMs);

  useEffect(() => {
    dispatch(subscribeToProperty({ uri }));
    return () => {
      dispatch(unsubscribeToProperty({ uri }));
    };
  }, [dispatch, uri]);

  return setFunc;
};
