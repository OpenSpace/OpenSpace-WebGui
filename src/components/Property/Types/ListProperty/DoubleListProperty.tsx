import { useGetDoubleListPropertyValue, useGetPropertyDescription } from '@/api/hooks';
import { PropertyProps } from '../../types';
import { Pills } from '../../../Pills/Pills';

export function DoubleListProperty({ uri }: PropertyProps) {
  const [value, setValue] = useGetDoubleListPropertyValue(uri);
  const description = useGetPropertyDescription(uri);

  if (!description || value === undefined) {
    return <></>;
  }

  const isReadOnly = description.metaData.isReadOnly;

  function setValueString(value: string[]) {
    setValue(value.map((item) => parseFloat(item)).filter((item) => !isNaN(item)));
  }

  return (
    <Pills
      value={value.map((v) => v.toString())}
      setValue={setValueString}
      placeHolderText="number1, number2, ..."
      isDisabled={isReadOnly}
    />
  );
}
