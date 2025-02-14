import { useContext, useEffect } from 'react';
import { shallowEqual, useThrottledCallback } from '@mantine/hooks';
import { throttle } from 'lodash';

import {
  subscribeToCameraPath,
  unsubscribeToCameraPath
} from '@/redux/camerapath/cameraPathMiddleware';
import {
  subscribeToEngineMode,
  unsubscribeToEngineMode
} from '@/redux/enginemode/engineModeMiddleware';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  subscribeToProperty,
  unsubscribeToProperty
} from '@/redux/propertytree/properties/propertiesMiddleware';
import { setPropertyValue } from '@/redux/propertytree/properties/propertiesSlice';
import { subscribeToTime, unsubscribeToTime } from '@/redux/time/timeMiddleware';
import { ConnectionStatus } from '@/types/enums';
import { Property, PropertyOwner, PropertyValue, Uri } from '@/types/types';
import { EnginePropertyVisibilityKey } from '@/util/keys';
import { hasVisibleChildren, isPropertyVisible } from '@/util/propertyTreeHelpers';
import { dateToOpenSpaceTimeString } from '@/util/time';

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

export const useSubscribeToTime = () => {
  const now = useAppSelector((state) => state.time.timeCapped);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(subscribeToTime());
    return () => {
      dispatch(unsubscribeToTime());
    };
  }, [dispatch]);
  return now;
};

export function useSubscribeToEngineMode() {
  const engineMode = useAppSelector((state) => state.engineMode.mode);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(subscribeToEngineMode());
    return () => {
      dispatch(unsubscribeToEngineMode());
    };
  }, [dispatch]);
  return engineMode;
}

export function useSubscribeToCameraPath() {
  const cameraPath = useAppSelector((state) => state.cameraPath);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(subscribeToCameraPath());
    return () => {
      dispatch(unsubscribeToCameraPath());
    };
  }, [dispatch]);

  return cameraPath;
}

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

/**
 * Find all the properties of a certain property owner that are visible, according to the
 * current visiblitity level setting. Also subscribe to changes for the visiblity level.
 */
export const useGetVisibleProperties = (propertyOwner: PropertyOwner | undefined) => {
  const [visiblityLevelSetting] = useGetOptionPropertyValue(EnginePropertyVisibilityKey);

  // @TODO (emmbr, 2024-12-03) Would be nicer if we didn't have to do the filtering as
  // part of the selector, but instead just get the state.properties.properties object
  // and then and do the filtering outside of the selector. However, as of now
  // state.properties.properties object includes the property values, and it would hence
  // lead to rerendering updates on every property change. One idea would be to seprate
  // the property values from the property descriptions in the redux store.
  return (
    useAppSelector(
      (state) =>
        propertyOwner?.properties.filter((p) =>
          isPropertyVisible(state.properties.properties[p], visiblityLevelSetting)
        ),
      shallowEqual
    ) || []
  );
};

export const useHasVisibleChildren = (propertyOwnerUri: Uri): boolean => {
  const [visiblityLevelSetting] = useGetOptionPropertyValue(EnginePropertyVisibilityKey);

  return useAppSelector((state) => {
    return hasVisibleChildren(
      propertyOwnerUri,
      visiblityLevelSetting,
      state.propertyOwners.propertyOwners,
      state.properties.propertyOverview
    );
  });
};

export function useIsConnectionStatus(status: ConnectionStatus): boolean {
  return useAppSelector((state) => state.connection.connectionStatus) === status;
}

export function useSetOpenSpaceTime() {
  const luaApi = useOpenSpaceApi();

  const setTime = (newTime: Date) => {
    const fixedTimeString = dateToOpenSpaceTimeString(newTime);
    luaApi?.time.setTime(fixedTimeString);
  };

  const interpolateTime = (newTime: Date) => {
    const fixedTimeString = dateToOpenSpaceTimeString(newTime);
    luaApi?.time.interpolateTime(fixedTimeString);
  };

  return [setTime, interpolateTime];
}
