import { MultiSelect } from '@mantine/core';

import { AdditionalDataSelection, PropertyProps } from '@/components/Property/types';
import { usePropertyDescription, useSelectionProperty } from '@/hooks/properties';
import { usePropListeningState } from '@/hooks/util';

export function SelectionProperty({ uri, readOnly }: PropertyProps) {
  const [value, setValue] = useSelectionProperty(uri);
  const { value: currentValue, setValue: setCurrentValue } = usePropListeningState<
    string[] | undefined
  >(value);

  const description = usePropertyDescription(uri);

  if (!value || !description || currentValue === undefined) {
    return <></>;
  }

  const { Options: options } = description.additionalData as AdditionalDataSelection;

  function handleChange(newValue: string[]) {
    setValue(newValue);
    setCurrentValue(newValue);
  }

  return (
    <MultiSelect
      aria-label={`${description.guiName} multi-select`}
      disabled={readOnly}
      data={options}
      value={currentValue}
      onChange={handleChange}
      placeholder={value.length === 0 ? 'No selection' : ''}
      searchable
      clearable
    />
  );
}
