import { Dispatch, UnknownAction } from '@reduxjs/toolkit';
import { throttle } from 'lodash';

import {
  subscribeToProperty,
  unsubscribeToProperty
} from '@/redux/propertytree/propertyTreeMiddleware';
import { setPropertyValue } from '@/redux/propertytree/propertyTreeSlice';
import { PropertyValue } from '@/types/types';

const ThrottleMs = 1000 / 60;

export function propertyDispatcher(dispatch: Dispatch<UnknownAction>, uri: string) {
  function set(value: PropertyValue) {
    dispatch(setPropertyValue({ uri: uri, value: value }));
  }
  return {
    subscribe: () => dispatch(subscribeToProperty({ uri: uri })),
    unsubscribe: () => dispatch(unsubscribeToProperty({ uri: uri })),
    set: throttle(set, ThrottleMs)
  };
}
