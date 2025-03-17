import { useGetIntListPropertyValue, useGetPropertyDescription } from '@/api/hooks';

import { Pills } from '../../../Pills/Pills';
import { PropertyProps } from '../../types';

export function IntListProperty({ uri }: PropertyProps) {
  const [value, setValue] = useGetIntListPropertyValue(uri);
  const description = useGetPropertyDescription(uri);

  if (!description || value === undefined) {
    return <></>;
  }

  const {isReadOnly} = description.metaData;

  function setValueString(value: string[]) {
    setValue(value.map((v) => parseInt(v)).filter((item) => !isNaN(item)));
  }

  return (
    <Pills
      value={value.map((v) => v.toString())}
      setValue={setValueString}
      placeHolderText={"integer1, integer2, ..."}
      isDisabled={isReadOnly}
    />
  );
}
