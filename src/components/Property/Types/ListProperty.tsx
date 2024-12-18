import { useEffect, useState } from 'react';
import { Pill, PillsInput } from '@mantine/core';

import { PropertyLabel } from '@/components/Property/PropertyLabel';

interface Props {
  name: string;
  description: string;
  disabled: boolean;
  setPropertyValue: (newValue: string[]) => void;
  value: string[];
}

export function ListProperty({
  name,
  description,
  disabled,
  setPropertyValue,
  value
}: Props) {
  const [placeholderText, setPlaceholderText] = useState('');

  // The input string that the user is typing
  const [inputString, setInputString] = useState('');

  // The values to shown as a list of pills in the input
  const [shownValues, setShownValues] = useState(value);

  const [isEditingExisting, setIsEditingExisting] = useState(false);
  const [clickedItemIndex, setClickedItemIndex] = useState<number | undefined>(undefined);

  useEffect(() => {
    setShownValues(value);
  }, [value]);

  useEffect(() => {
    setPlaceholderText(placeholder(shownValues));
  }, [shownValues]);

  function placeholder(values: string[]) {
    return `item${values.length + 1}, item${values.length + 2}, ...`;
  }

  function onInputKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
    const input = inputString.trim();

    if (event.key === 'Enter' && input.length > 0) {
      const splitInput = input
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

      const newValues = [...shownValues, ...splitInput];
      setPropertyValue(newValues);
      setShownValues(newValues);
      stopEditing();
    } else if (!isEditingExisting && event.key === 'Backspace') {
      setIsEditingExisting(true);
      setInputString(value.join(', '));
      setShownValues([]);
    } else if (event.key === 'Escape') {
      stopEditing();
      event.currentTarget.blur();
    }
  }

  function stopEditing() {
    setInputString('');
    setIsEditingExisting(false);
    setClickedItemIndex(undefined);
  }

  function deleteItem(index: number) {
    const newValues = [...value];
    newValues.splice(index, 1);

    setPropertyValue(newValues);
    setShownValues(newValues);

    setClickedItemIndex(undefined);
  }

  function onItemClick(index: number) {
    if (disabled) {
      return;
    }
    const isCurrent = clickedItemIndex === index;
    setClickedItemIndex(isCurrent ? undefined : index);
  }

  return (
    <PillsInput
      disabled={disabled}
      onBlur={() => stopEditing()}
      label={<PropertyLabel label={name} tip={description} />}
    >
      <Pill.Group>
        {shownValues.map((v, i) => (
          <Pill
            key={v}
            style={disabled ? {} : { cursor: 'pointer' }}
            withRemoveButton={clickedItemIndex === i}
            onRemove={() => deleteItem(i)}
            onClick={() => onItemClick(i)}
          >
            {v}
          </Pill>
        ))}
        <PillsInput.Field
          placeholder={placeholderText}
          value={inputString}
          onFocus={() => setPlaceholderText(placeholder(shownValues))}
          onBlur={() => setPlaceholderText('')}
          onChange={(event) => setInputString(event.currentTarget.value)}
          onKeyUp={(event) => onInputKeyUp(event)}
        />
      </Pill.Group>
    </PillsInput>
  );
}
