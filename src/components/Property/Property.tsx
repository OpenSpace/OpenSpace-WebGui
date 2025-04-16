import { memo } from 'react';
import { Stack } from '@mantine/core';

import { useAppSelector } from '@/redux/hooks';
import { Uri } from '@/types/types';

import { BoolProperty } from './Types/BoolProperty';
import { DoubleListProperty } from './Types/ListProperty/DoubleListProperty';
import { IntListProperty } from './Types/ListProperty/IntListProperty';
import { StringListProperty } from './Types/ListProperty/StringListProperty';
import { MatrixProperty } from './Types/MatrixProperty';
import { NumericProperty } from './Types/NumericProperty/NumericProperty';
import { OptionProperty } from './Types/OptionProperty';
import { SelectionProperty } from './Types/SelectionProperty';
import { StringProperty } from './Types/StringProperty';
import { TriggerProperty } from './Types/TriggerProperty';
import { VectorProperty } from './Types/VectorProperty/VectorProperty';
import { PropertyLabel } from './PropertyLabel';

// The readOnly prop sent to each component are meant to enforce each
// Property component to have to handle the readOnly state. This can
// easily be forgotten otherwise.
function renderProperty(type: string, uri: Uri, readOnly: boolean): React.JSX.Element {
  switch (type) {
    case 'BoolProperty':
      return <BoolProperty uri={uri} readOnly={readOnly} />;
    case 'OptionProperty':
      return <OptionProperty uri={uri} readOnly={readOnly} />;
    case 'TriggerProperty':
      return <TriggerProperty uri={uri} readOnly={readOnly} />;
    case 'StringProperty':
      return <StringProperty uri={uri} readOnly={readOnly} />;
    case 'DoubleListProperty':
      return <DoubleListProperty uri={uri} readOnly={readOnly} />;
    case 'IntListProperty':
      return <IntListProperty uri={uri} readOnly={readOnly} />;
    case 'StringListProperty':
      return <StringListProperty uri={uri} readOnly={readOnly} />;
    case 'SelectionProperty':
      return <SelectionProperty uri={uri} readOnly={readOnly} />;
    case 'FloatProperty':
    case 'DoubleProperty':
    case 'ShortProperty':
    case 'UShortProperty':
      return <NumericProperty uri={uri} readOnly={readOnly} />;
    case 'LongProperty':
    case 'ULongProperty':
    case 'IntProperty':
    case 'UIntProperty':
      return <NumericProperty isInt uri={uri} readOnly={readOnly} />;
    case 'Vec2Property':
    case 'Vec3Property':
    case 'Vec4Property':
    case 'DVec2Property':
    case 'DVec3Property':
    case 'DVec4Property':
      return <VectorProperty uri={uri} readOnly={readOnly} />;
    case 'IVec2Property':
    case 'IVec3Property':
    case 'IVec4Property':
    case 'UVec2Property':
    case 'UVec3Property':
    case 'UVec4Property':
      return <VectorProperty uri={uri} isInt readOnly={readOnly} />;
    case 'Mat2Property':
    case 'Mat3Property':
    case 'Mat4Property':
    case 'DMat2Property':
    case 'DMat3Property':
    case 'DMat4Property':
      return <MatrixProperty uri={uri} readOnly={readOnly} />;
    default:
      throw new Error(`Missing property type: '${type}'`);
  }
}

interface Props {
  uri: Uri;
}

export const Property = memo(({ uri }: Props) => {
  const meta = useAppSelector((state) => state.properties.properties[uri]?.metaData);

  if (!meta) {
    return <></>;
  }

  const showLabel = !(meta.type === 'BoolProperty' || meta.type === 'TriggerProperty');

  return (
    <Stack mb={'md'} gap={5}>
      {showLabel && <PropertyLabel uri={uri} readOnly={meta.isReadOnly} />}
      {renderProperty(meta.type, uri, meta.isReadOnly)}
    </Stack>
  );
});
