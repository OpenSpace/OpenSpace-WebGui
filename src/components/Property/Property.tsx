import { useEffect } from 'react';
import { Box } from '@mantine/core';
import { PropertyValue } from 'src/types/types';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  subscribeToProperty,
  unsubscribeToProperty
} from '@/redux/propertytree/properties/propertiesMiddleware';
import { setPropertyValue } from '@/redux/propertytree/properties/propertiesSlice';

import { ListProperty } from './/Types/ListProperty';
import { BoolProperty } from './Types/BoolProperty';
import { MatrixProperty } from './Types/MatrixProperty';
import { NumericProperty } from './Types/NumericProperty';
import { OptionProperty } from './Types/OptionProperty';
import { SelectionProperty } from './Types/SelectionProperty';
import { StringProperty } from './Types/StringProperty';
import { TriggerProperty } from './Types/TriggerProperty';
import { VectorProperty } from './Types/VectorProperty/VectorProperty';

// (2024-10-21, emmbr) I don't know how to efficiently get rid of "any" in this case
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const concreteProperties: { [key: string]: any } = {
  BoolProperty,
  OptionProperty,
  TriggerProperty,
  StringProperty,

  // TODO: The numerical lists have to be fixed, still. There is no DoubleListProperty
  // in use anywhere, and the only IntListProperty I could find did not work in the existing
  // UI
  // DoubleListProperty: ListProperty,
  // IntListProperty: ListProperty,
  StringListProperty: ListProperty,

  SelectionProperty,

  FloatProperty: NumericProperty,
  DoubleProperty: NumericProperty,
  LongProperty: NumericProperty,
  ULongProperty: NumericProperty,
  IntProperty: NumericProperty,
  UIntProperty: NumericProperty,
  ShortProperty: NumericProperty,
  UShortProperty: NumericProperty,

  Vec2Property: VectorProperty,
  Vec3Property: VectorProperty,
  Vec4Property: VectorProperty,

  IVec2Property: VectorProperty,
  IVec3Property: VectorProperty,
  IVec4Property: VectorProperty,

  UVec2Property: VectorProperty,
  UVec3Property: VectorProperty,
  UVec4Property: VectorProperty,

  DVec2Property: VectorProperty,
  DVec3Property: VectorProperty,
  DVec4Property: VectorProperty,

  Mat2Property: MatrixProperty,
  Mat3Property: MatrixProperty,
  Mat4Property: MatrixProperty,

  DMat2Property: MatrixProperty,
  DMat3Property: MatrixProperty,
  DMat4Property: MatrixProperty
};

interface Props {
  uri: string;
}

export function Property({ uri }: Props) {
  // TODO: The state here has been changed. Should just be propertyTree.properties. Or
  // maybe even just state.properties?
  const description = useAppSelector(
    (state) => state.properties.properties[uri]?.description
  );

  const value = useAppSelector((state) => state.properties.properties[uri]?.value);
  const dispatch = useAppDispatch();
  // TODO: These actions should not have to take an object. The string value is enough
  // when there is only one value in the payload!
  useEffect(() => {
    dispatch(subscribeToProperty({ uri }));
    return () => {
      dispatch(unsubscribeToProperty({ uri }));
    };
  }, [dispatch, uri]);

  if (!description || value === undefined) {
    return null;
  }

  const ConcreteProperty = concreteProperties[description.type];

  if (!ConcreteProperty) {
    // TODO: Bring back once all types are implemented
    // console.error('Missing property type', property.description.type);
    return null;
  }

  // console.log(property);

  return (
    // All the property types get all informaiton, and then they may do whatever they
    // want with it (like ignore certain parts)
    <Box pb={'xs'}>
      <ConcreteProperty
        key={description.identifier}
        disabled={description.metaData.isReadOnly}
        name={description.name}
        description={description.description}
        value={value}
        setPropertyValue={(newValue: PropertyValue) => {
          dispatch(setPropertyValue({ uri, value: newValue }));
        }}
        viewOptions={description.metaData.ViewOptions}
        additionalData={description.additionalData}
      />
    </Box>
  );
}
