import { useGetDoubleListPropertyValue, useGetPropertyDescription } from '@/api/hooks';

import { Pills } from '../../../Pills/Pills';
import { PropertyProps } from '../../types';

export function DoubleListProperty({ uri }: PropertyProps) {
  const [value, setValue] = useGetDoubleListPropertyValue(uri);
  const description = useGetPropertyDescription(uri);

  if (!description || value === undefined) {
    return <></>;
  }

  const {isReadOnly} = description.metaData;

  function setValueString(value: string[]) {
    setValue(value.map((item) => parseFloat(item)).filter((item) => !isNaN(item)));
  }

  return (
    <Pills
      value={value.map((v) => v.toString())}
      setValue={setValueString}
      placeHolderText={"number1, number2, ..."}
      isDisabled={isReadOnly}
    />
  );
}
