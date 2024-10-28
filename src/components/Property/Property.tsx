import { useEffect } from 'react';
import { PropertyValue } from 'src/types/types';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  subscribeToProperty,
  unsubscribeToProperty
} from '@/redux/propertytree/propertyTreeMiddleware';
import { setPropertyValue } from '@/redux/propertytree/propertyTreeSlice';

import { ListProperty } from './/Types/ListProperty';
import { BoolProperty } from './Types/BoolProperty';
// import MatrixProperty from './MatrixProperty';
import { NumericProperty } from './Types/NumericProperty';
import { OptionProperty } from './Types/OptionProperty';
import { SelectionProperty } from './Types/SelectionProperty';
import { StringProperty } from './Types/StringProperty';
import { TriggerProperty } from './Types/TriggerProperty';
// import VecProperty from './VectorProperty';

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

  //   Vec2Property: VecProperty,
  //   Vec3Property: VecProperty,
  //   Vec4Property: VecProperty,

  //   IVec2Property: VecProperty,
  //   IVec3Property: VecProperty,
  //   IVec4Property: VecProperty,

  //   UVec2Property: VecProperty,
  //   UVec3Property: VecProperty,
  //   UVec4Property: VecProperty,

  //   DVec2Property: VecProperty,
  //   DVec3Property: VecProperty,
  //   DVec4Property: VecProperty,

  //   Mat2Property: MatrixProperty,
  //   Mat3Property: MatrixProperty,
  //   Mat4Property: MatrixProperty,

  //   DMat2Property: MatrixProperty,
  //   DMat3Property: MatrixProperty,
  //   DMat4Property: MatrixProperty
};

interface Props {
  uri: string;
}

export function Property({ uri }: Props) {
  // TODO: The state here has been changed. Should just be propertyTree.properties. Or
  // maybe even just state.properties?
  const property = useAppSelector((state) => state.propertyTree.props.properties[uri]);

  const dispatch = useAppDispatch();
  // TODO: These actions should not have to take an object. The string value is enough
  // when there is only one value in the payload!
  useEffect(() => {
    dispatch(subscribeToProperty({ uri }));
    return () => {
      dispatch(unsubscribeToProperty({ uri }));
    };
  });

  if (!property) return null;

  const ConcreteProperty = concreteProperties[property.description.type];

  if (!ConcreteProperty) {
    console.error('Missing property type', property.description.type);
    return null;
  }

  console.log(property);

  return (
    // All the property types get all informaiton, and then they may do whatever they
    // want with it (like ignore certain parts)
    <ConcreteProperty
      key={property.description.identifier}
      disabled={property.description.metaData.isReadOnly}
      name={property.description.name}
      description={property.description.description}
      value={property.value}
      setPropertyValue={(newValue: PropertyValue) => {
        dispatch(setPropertyValue({ uri, value: newValue }));
      }}
      metaData={property.description.metaData}
      additionalData={property.description.additionalData}
    />
  );
}
