import { useAppSelector } from '@/redux/hooks';
import { Property } from '@/types/types';

// Hook to make it easier to get the api
export function useOpenSpaceApi() {
  const api = useAppSelector((state) => state.luaApi);
  return api;
}

export function useGetProperty(uri: string): Property | undefined {
  return useAppSelector((state) => state.propertyTree.props.properties[uri]);
}

function useGetPropertyValue<T>(uri: string, propertyType: string): T | undefined {
  return useAppSelector((state) => {
    const prop = state.propertyTree.props.properties[uri];
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

export const useGetNumberPropertyValue = (uri: string) =>
  useGetPropertyValue<number>(uri, 'IntProperty');

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
export const useGetIVec3Value = (uri: string) =>
  useGetPropertyValue<number[]>(uri, 'IVec3Property');

export const useGetIVec4Value = (uri: string) =>
  useGetPropertyValue<number[]>(uri, 'IVec4Property');

export const useGetUVec2Value = (uri: string) =>
  useGetPropertyValue<number[]>(uri, 'UVec2Property');

export const useGetUVec3Value = (uri: string) =>
  useGetPropertyValue<number[]>(uri, 'UVec3Property');

export const useGetUVec4Value = (uri: string) =>
  useGetPropertyValue<number[]>(uri, 'UVec4Property');

export const useGetVec2Value = (uri: string) =>
  useGetPropertyValue<number[]>(uri, 'Vec2Property');

export const useGetVec3Value = (uri: string) =>
  useGetPropertyValue<number[]>(uri, 'Vec3Property');

export const useGetVec4Value = (uri: string) =>
  useGetPropertyValue<number[]>(uri, 'Vec4Property');

// Scalars
export const useGetDoubleValue = (uri: string) =>
  useGetPropertyValue<number>(uri, 'DoubleProperty');

export const useGetFloatValue = (uri: string) =>
  useGetPropertyValue<number>(uri, 'FloatProperty');

export const useGetIntValue = (uri: string) =>
  useGetPropertyValue<number>(uri, 'IntProperty');

export const useGetLongValue = (uri: string) =>
  useGetPropertyValue<number>(uri, 'LongProperty');

export const useGetShortValue = (uri: string) =>
  useGetPropertyValue<number>(uri, 'ShortProperty');

export const useGetUIntValue = (uri: string) =>
  useGetPropertyValue<number>(uri, 'UIntProperty');

export const useGetULongValue = (uri: string) =>
  useGetPropertyValue<number>(uri, 'ULongProperty');

export const useGetUShortValue = (uri: string) =>
  useGetPropertyValue<number>(uri, 'UShortProperty');

// Matrices
export const useGetDMat2Value = (uri: string) =>
  useGetPropertyValue<number[]>(uri, 'DMat2Property');

export const useGetDMat3Value = (uri: string) =>
  useGetPropertyValue<number[]>(uri, 'DMat3Property');

export const useGetDMat4Value = (uri: string) =>
  useGetPropertyValue<number[]>(uri, 'DMat4Property');

export const useGetMat2Value = (uri: string) =>
  useGetPropertyValue<number[]>(uri, 'Mat2Property');

export const useGetMat3Value = (uri: string) =>
  useGetPropertyValue<number[]>(uri, 'Mat3Property');

export const useGetMat4Value = (uri: string) =>
  useGetPropertyValue<number[]>(uri, 'Mat4Property');

// Lists
export const useGetDoubleListValue = (uri: string) =>
  useGetPropertyValue<number[]>(uri, 'DoubleListProperty');

export const useGetIntListValue = (uri: string) =>
  useGetPropertyValue<number[]>(uri, 'IntListProperty');

export const useGetStringListValue = (uri: string) =>
  useGetPropertyValue<string[]>(uri, 'StringListProperty');
