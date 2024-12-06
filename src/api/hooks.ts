import { useEffect } from 'react';
import { useThrottledCallback } from '@mantine/hooks';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  subscribeToProperty,
  unsubscribeToProperty
} from '@/redux/propertytree/properties/propertiesMiddleware';
import { setPropertyValue } from '@/redux/propertytree/properties/propertiesSlice';
import { Property, PropertyOwner, PropertyValue } from '@/types/types';
// Hook to make it easier to get the api
export function useOpenSpaceApi() {
  const api = useAppSelector((state) => state.luaApi);
  return api;
}

export function useGetPropertyOwner(uri: string): PropertyOwner | undefined {
  return useAppSelector((state) => state.propertyOwners.propertyOwners[uri]);
}

export function useGetProperty(uri: string): Property | undefined {
  return useAppSelector((state) => state.properties.properties[uri]);
}

function useGetPropertyValue<T>(uri: string, propertyType: string): T | undefined {
  return useAppSelector((state) => {
    const prop = state.properties.properties[uri];
    if (prop && prop?.description.type !== propertyType) {
      throw Error(`Requested a ${propertyType} but got a ${prop.description.type}`);
    }
    return prop?.value;
  }) as T | undefined;
}

export const useGetBoolPropertyValue = (uri: string) =>
  useGetPropertyValue<boolean>(uri, 'BoolProperty');

export const useGetStringPropertyValue = (uri: string) =>
  useGetPropertyValue<string>(uri, 'StringProperty');

export const useGetSelectionPropertyValue = (uri: string) =>
  useGetPropertyValue<number>(uri, 'SelectionProperty');

export const useGetOptionPropertyValue = (uri: string) =>
  useGetPropertyValue<number>(uri, 'OptionProperty');

// Vectors
export const useGetDVec2PropertyValue = (uri: string) =>
  useGetPropertyValue<number[]>(uri, 'DVec2Property');

export const useGetDVec3PropertyValue = (uri: string) =>
  useGetPropertyValue<number[]>(uri, 'DVec3Property');

export const useGetDVec4PropertyValue = (uri: string) =>
  useGetPropertyValue<number[]>(uri, 'DVec4Property');

export const useGetIVec2PropertyValue = (uri: string) =>
  useGetPropertyValue<number[]>(uri, 'IVec2Property');
// Vectors
export const useGetIVec3PropertyValue = (uri: string) =>
  useGetPropertyValue<number[]>(uri, 'IVec3Property');

export const useGetIVec4PropertyValue = (uri: string) =>
  useGetPropertyValue<number[]>(uri, 'IVec4Property');

export const useGetUVec2PropertyValue = (uri: string) =>
  useGetPropertyValue<number[]>(uri, 'UVec2Property');

export const useGetUVec3PropertyValue = (uri: string) =>
  useGetPropertyValue<number[]>(uri, 'UVec3Property');

export const useGetUVec4PropertyValue = (uri: string) =>
  useGetPropertyValue<number[]>(uri, 'UVec4Property');

export const useGetVec2PropertyValue = (uri: string) =>
  useGetPropertyValue<number[]>(uri, 'Vec2Property');

export const useGetVec3PropertyValue = (uri: string) =>
  useGetPropertyValue<number[]>(uri, 'Vec3Property');

export const useGetVec4PropertyValue = (uri: string) =>
  useGetPropertyValue<number[]>(uri, 'Vec4Property');

// Scalars
export const useGetDoublePropertyValue = (uri: string) =>
  useGetPropertyValue<number>(uri, 'DoubleProperty');

export const useGetFloatPropertyValue = (uri: string) =>
  useGetPropertyValue<number>(uri, 'FloatProperty');

export const useGetIntPropertyValue = (uri: string) =>
  useGetPropertyValue<number>(uri, 'IntProperty');

export const useGetLongPropertyValue = (uri: string) =>
  useGetPropertyValue<number>(uri, 'LongProperty');

export const useGetShortPropertyValue = (uri: string) =>
  useGetPropertyValue<number>(uri, 'ShortProperty');

export const useGetUIntPropertyValue = (uri: string) =>
  useGetPropertyValue<number>(uri, 'UIntProperty');

export const useGetULongPropertyValue = (uri: string) =>
  useGetPropertyValue<number>(uri, 'ULongProperty');

export const useGetUShortPropertyValue = (uri: string) =>
  useGetPropertyValue<number>(uri, 'UShortProperty');

// Matrices
export const useGetDMat2PropertyValue = (uri: string) =>
  useGetPropertyValue<number[]>(uri, 'DMat2Property');

export const useGetDMat3PropertyValue = (uri: string) =>
  useGetPropertyValue<number[]>(uri, 'DMat3Property');

export const useGetDMat4PropertyValue = (uri: string) =>
  useGetPropertyValue<number[]>(uri, 'DMat4Property');

export const useGetMat2PropertyValue = (uri: string) =>
  useGetPropertyValue<number[]>(uri, 'Mat2Property');

export const useGetMat3PropertyValue = (uri: string) =>
  useGetPropertyValue<number[]>(uri, 'Mat3Property');

export const useGetMat4PropertyValue = (uri: string) =>
  useGetPropertyValue<number[]>(uri, 'Mat4Property');

// Lists
export const useGetDoubleListPropertyValue = (uri: string) =>
  useGetPropertyValue<number[]>(uri, 'DoubleListProperty');

export const useGetIntListPropertyValue = (uri: string) =>
  useGetPropertyValue<number[]>(uri, 'IntListProperty');

export const useGetStringListPropertyValue = (uri: string) =>
  useGetPropertyValue<string[]>(uri, 'StringListProperty');

/**
 * Hook that subscribes to a property and returns a setter function. Unsuscribes when the
 * component is unmounted.
 */
export const useSubscribeToProperty = (uri: string) => {
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
