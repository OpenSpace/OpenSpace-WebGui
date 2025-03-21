import { memo } from 'react';
import { Stack } from '@mantine/core';

import { useGetProperty, useSubscribeToProperty } from '@/api/hooks';
import { Uri } from '@/types/types';

import { BoolProperty } from './Types/BoolProperty';
import { FloatListProperty } from './Types/ListProperty/FloatListProperty';
import { IntListProperty } from './Types/ListProperty/IntListProperty';
import { StringListProperty } from './Types/ListProperty/StringListProperty';
import { MatrixProperty } from './Types/MatrixProperty';
import { IntNumericProperty } from './Types/NumericProperty/IntNumericProperty';
import { NumericProperty } from './Types/NumericProperty/NumericProperty';
import { OptionProperty } from './Types/OptionProperty';
import { SelectionProperty } from './Types/SelectionProperty';
import { StringProperty } from './Types/StringProperty';
import { TriggerProperty } from './Types/TriggerProperty';
import { IntVectorProperty } from './Types/VectorProperty/IntVectorProperty';
import { VectorProperty } from './Types/VectorProperty/VectorProperty';
import { PropertyLabel } from './PropertyLabel';

// (2024-10-21, emmbr) I don't know how to efficiently get rid of "any" in this case
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const concreteProperties: { [key: string]: any } = {
  BoolProperty,
  OptionProperty,
  TriggerProperty,
  StringProperty,

  DoubleListProperty: FloatListProperty,
  IntListProperty,
  StringListProperty,

  SelectionProperty,

  FloatProperty: NumericProperty,
  DoubleProperty: NumericProperty,
  LongProperty: NumericProperty,
  ULongProperty: NumericProperty,
  IntProperty: IntNumericProperty,
  UIntProperty: IntNumericProperty,
  ShortProperty: NumericProperty,
  UShortProperty: NumericProperty,

  Vec2Property: VectorProperty,
  Vec3Property: VectorProperty,
  Vec4Property: VectorProperty,

  IVec2Property: IntVectorProperty,
  IVec3Property: IntVectorProperty,
  IVec4Property: IntVectorProperty,

  UVec2Property: IntVectorProperty,
  UVec3Property: IntVectorProperty,
  UVec4Property: IntVectorProperty,

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
  uri: Uri;
}

export const Property = memo(({ uri }: Props) => {
  const property = useGetProperty(uri);
  const setPropertyValue = useSubscribeToProperty(uri);

  const description = property?.description;
  const value = property?.value;

  if (!description || value === undefined) {
    return <></>;
  }

  const ConcreteProperty = concreteProperties[description.type];

  if (!ConcreteProperty) {
    throw Error(`Missing property type: '${property.description.type}'`);
  }

  // In most cases we want to show the label on top of the property input, but some types
  // have a custom label built in in the input type. Keep track of which that is
  const hasBuiltInLabel =
    ConcreteProperty === BoolProperty || ConcreteProperty === TriggerProperty;

  // All the property types get all information, and then they may do whatever they
  // want with it (like ignore certain parts)
  return (
    <Stack mb={'md'} gap={5}>
      {!hasBuiltInLabel && (
        <PropertyLabel
          label={description.name}
          tip={description.description}
          isReadOnly={description.metaData.isReadOnly}
        />
      )}
      <ConcreteProperty
        key={description.identifier}
        disabled={description.metaData.isReadOnly}
        name={description.name}
        description={description.description}
        value={value}
        setPropertyValue={setPropertyValue}
        viewOptions={description.metaData.ViewOptions}
        additionalData={description.additionalData}
      />
    </Stack>
  );
});
