import { useGetPropertyDescription, useGetStringListPropertyValue } from '@/api/hooks';
import { PropertyProps } from '../../types';
import { Pills } from '../../../Pills/Pills';

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
      placeHolderText="item1, item2, ..."
      isDisabled={isReadOnly}
    />
  );
}
