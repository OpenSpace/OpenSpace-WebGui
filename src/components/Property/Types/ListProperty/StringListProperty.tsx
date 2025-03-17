import { useGetPropertyDescription, useGetStringListPropertyValue } from '@/api/hooks';

import { Pills } from '../../../Pills/Pills';
import { PropertyProps } from '../../types';

export function StringListProperty({ uri }: PropertyProps) {
  const [value, setValue] = useGetStringListPropertyValue(uri);
  const description = useGetPropertyDescription(uri);

  if (!description || value === undefined) {
    return <></>;
  }

  const isReadOnly = description?.metaData.isReadOnly;
  return (
    <Pills
      value={value}
      setValue={setValue}
      placeHolderText={"item1, item2, ..."}
      isDisabled={isReadOnly}
    />
  );
}
