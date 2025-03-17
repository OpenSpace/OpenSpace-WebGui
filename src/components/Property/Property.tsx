import { memo } from 'react';

import { BoolProperty } from './Types/BoolProperty';

import { MatrixProperty } from './Types/MatrixProperty';
import { NumericProperty } from './Types/NumericProperty/NumericProperty';
import { OptionProperty } from './Types/OptionProperty';
import { SelectionProperty } from './Types/SelectionProperty';
import { StringProperty } from './Types/StringProperty';
import { TriggerProperty } from './Types/TriggerProperty';
import { VectorProperty } from './Types/VectorProperty/VectorProperty';
import { useAppSelector } from '@/redux/hooks';
import { DoubleListProperty } from './Types/ListProperty/DoubleListProperty';
import { IntListProperty } from './Types/ListProperty/IntListProperty';
import { StringListProperty } from './Types/ListProperty/StringListProperty';
import { PropertyProps } from './types';
import { PropertyLabel } from './PropertyLabel';
import { Stack } from '@mantine/core';

const renderProperty = (type: string, uri: string) => {
  switch (type) {
    case 'BoolProperty':
      return <BoolProperty uri={uri} />;
    case 'OptionProperty':
      return <OptionProperty uri={uri} />;
    case 'TriggerProperty':
      return <TriggerProperty uri={uri} />;
    case 'StringProperty':
      return <StringProperty uri={uri} />;
    case 'DoubleListProperty':
      return <DoubleListProperty uri={uri} />;
    case 'IntListProperty':
      return <IntListProperty uri={uri} />;
    case 'StringListProperty':
      return <StringListProperty uri={uri} />;
    case 'SelectionProperty':
      return <SelectionProperty uri={uri} />;
    case 'FloatProperty':
    case 'DoubleProperty':
    case 'ShortProperty':
    case 'UShortProperty':
      return <NumericProperty uri={uri} />;
    case 'LongProperty':
    case 'ULongProperty':
    case 'IntProperty':
    case 'UIntProperty':
      return <NumericProperty isInt uri={uri} />;
    case 'Vec2Property':
    case 'Vec3Property':
    case 'Vec4Property':
    case 'DVec2Property':
    case 'DVec3Property':
    case 'DVec4Property':
      return <VectorProperty uri={uri} />;
    case 'IVec2Property':
    case 'IVec3Property':
    case 'IVec4Property':
    case 'UVec2Property':
    case 'UVec3Property':
    case 'UVec4Property':
      return <VectorProperty uri={uri} isInt />;
    case 'Mat2Property':
    case 'Mat3Property':
    case 'Mat4Property':
    case 'DMat2Property':
    case 'DMat3Property':
    case 'DMat4Property':
      return <MatrixProperty uri={uri} />;
    default:
      throw new Error(`Missing property type: '${type}'`);
  }
};

export const Property = memo(({ uri }: PropertyProps) => {
  const propertyType = useAppSelector(
    (state) => state.properties.properties[uri]?.description.type
  );

  if (!propertyType) {
    return <></>;
  }

  const hasLabel = !(
    propertyType === 'BoolProperty' || propertyType === 'TriggerProperty'
  );

  return (
    <Stack mb={'md'} gap={5}>
      {hasLabel && <PropertyLabel uri={uri} />}
      {renderProperty(propertyType, uri)}
    </Stack>
  );
});
