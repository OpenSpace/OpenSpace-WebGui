import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { PropertyVisibilityNumber } from './enums';
import {
  AdditionalDataNumber,
  AdditionalDataOptions,
  AdditionalDataSelection,
  AdditionalDataVectorMatrix
} from '@/components/Property/types';
import {
  subscribeToProperty,
  unsubscribeToProperty
} from '@/redux/propertytree/properties/propertiesMiddleware';
import { setPropertyValue } from '@/redux/propertytree/properties/propertiesSlice';
import { useThrottledCallback } from '@mantine/hooks';
import { useEffect } from 'react';

export type PropertyVisibility = keyof typeof PropertyVisibilityNumber;

export interface BasePropertyMetaData {
  description: string;
  isReadOnly: boolean;
  guiName: string;
  group: string;
  needsConfirmation: boolean;
  visibility: PropertyVisibility;
  viewOptions?: Record<string, boolean>;
}

export type Property<T extends keyof PropertyTypeMap = keyof PropertyTypeMap> = {
  metaData: BasePropertyMetaData & {
    type: T;
    additionalData?: PropertyTypeMap[T]['additionalData'];
  };
  value: PropertyTypeMap[T]['value'];
  uri: string;
};

export type AnyProperty = {
  [K in keyof PropertyTypeMap]: Property<K>;
}[keyof PropertyTypeMap];

export function useProperty<T extends keyof PropertyTypeMap>(
  type: T,
  uri: string
): [Property<T>['value'] | undefined, (value: T) => void, Property<T>['metaData']] {
  const prop = useAppSelector((state) => state.properties.properties[uri] as Property<T>);
  if (prop.metaData.type !== type) {
    throw new Error(
      `Tried to access property with uri ${uri} as type ${type}, but it is of type ${prop.metaData.type}`
    );
  }
  const dispatch = useAppDispatch();
  // Throttle limit
  const ThrottleMs = 1000 / 60;

  // Every time we want a property value we also want to make sure we get the
  // updated value. Hence we subscribe
  useEffect(() => {
    dispatch(subscribeToProperty({ uri: uri }));
    return () => {
      dispatch(unsubscribeToProperty({ uri: uri }));
    };
  }, [dispatch, uri]);

  // Set function to mimic useState
  const setValue = useThrottledCallback((value: Property<T>['value']) => {
    dispatch(setPropertyValue({ uri: uri, value: value }));
  }, ThrottleMs);

  return [prop.value, setValue, prop.metaData];
}

type PropertyTypeMap = {
  BoolProperty: {
    value: boolean;
    additionalData: undefined;
  };
  StringProperty: {
    value: string;
    additionalData: undefined;
  };
  MatrixProperty: {
    value: number[];
    additionalData: AdditionalDataVectorMatrix;
  };
  SelectionProperty: {
    value: string[];
    additionalData: AdditionalDataSelection;
  };
  OptionProperty: {
    value: number;
    additionalData: AdditionalDataOptions;
  };
  Vec2Property: {
    value: number[];
    additionalData: AdditionalDataVectorMatrix;
  };
  Vec3Property: {
    value: number[];
    additionalData: AdditionalDataVectorMatrix;
  };
  Vec4Property: {
    value: number[];
    additionalData: AdditionalDataVectorMatrix;
  };
  DVec2Property: {
    value: number[];
    additionalData: AdditionalDataVectorMatrix;
  };
  DVec3Property: {
    value: number[];
    additionalData: AdditionalDataVectorMatrix;
  };
  DVec4Property: {
    value: number[];
    additionalData: AdditionalDataVectorMatrix;
  };
  IVec2Property: {
    value: number[];
    additionalData: AdditionalDataVectorMatrix;
  };
  IVec3Property: {
    value: number[];
    additionalData: AdditionalDataVectorMatrix;
  };
  IVec4Property: {
    value: number[];
    additionalData: AdditionalDataVectorMatrix;
  };
  UVec2Property: {
    value: number[];
    additionalData: AdditionalDataVectorMatrix;
  };
  UVec3Property: {
    value: number[];
    additionalData: AdditionalDataVectorMatrix;
  };
  UVec4Property: {
    value: number[];
    additionalData: AdditionalDataVectorMatrix;
  };
  DoubleProperty: {
    value: number;
    additionalData: AdditionalDataVectorMatrix;
  };
  FloatProperty: {
    value: number;
    additionalData: AdditionalDataNumber;
  };
  IntProperty: {
    value: number;
    additionalData: AdditionalDataNumber;
  };
  LongProperty: {
    value: number;
    additionalData: AdditionalDataNumber;
  };
  ShortProperty: {
    value: number;
    additionalData: AdditionalDataNumber;
  };
  UIntProperty: {
    value: number;
    additionalData: AdditionalDataNumber;
  };
  ULongProperty: {
    value: number;
    additionalData: AdditionalDataNumber;
  };
  UShortProperty: {
    value: number;
    additionalData: AdditionalDataNumber;
  };
  Mat2Property: {
    value: number[];
    additionalData: AdditionalDataVectorMatrix;
  };
  Mat3Property: {
    value: number[];
    additionalData: AdditionalDataVectorMatrix;
  };
  Mat4Property: {
    value: number[];
    additionalData: AdditionalDataVectorMatrix;
  };
  DMat2Property: {
    value: number[];
    additionalData: AdditionalDataVectorMatrix;
  };
  DMat3Property: {
    value: number[];
    additionalData: AdditionalDataVectorMatrix;
  };
  DMat4Property: {
    value: number[];
    additionalData: AdditionalDataVectorMatrix;
  };
  DoubleListProperty: {
    value: number[];
    additionalData: undefined;
  };
  IntListProperty: {
    value: number[];
    additionalData: undefined;
  };
  StringListProperty: {
    value: string[];
    additionalData: undefined;
  };
};
