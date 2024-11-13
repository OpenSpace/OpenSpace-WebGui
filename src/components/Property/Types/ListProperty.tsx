import { useState } from 'react';
import { Pill, PillsInput } from '@mantine/core';

import { PropertyLabel } from '../PropertyLabel';

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
  const [inputString, setInputString] = useState<string>('');
  const [editedIndex, setEditedIndex] = useState<number | undefined>(undefined);

  function onInputFieldKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
    const newItem = inputString.trim();
    if (event.key === 'Enter' && newItem.length > 0) {
      setPropertyValue([...value, newItem]);
      stopEditing();
    } else if (event.key === 'Escape') {
      stopEditing();
      event.currentTarget.blur();
    }
  }

  function onKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowLeft') {
      if (editedIndex === undefined) {
        setEditedIndex(value.length - 1);
      } else {
        setEditedIndex(Math.max(editedIndex - 1, 0));
      }
    } else if (event.key === 'ArrowRight') {
      if (editedIndex !== undefined) {
        setEditedIndex(Math.max(editedIndex + 1, 0));
      } else if (editedIndex === value.length - 1) {
        setEditedIndex(undefined);
      }
    } else if (event.key === 'Escape') {
      stopEditing();
      event.currentTarget.blur();
    }
  }

  function stopEditing() {
    setInputString('');
    setEditedIndex(undefined);
  }

  function deleteItem(index: number) {
    const newValues = [...value];
    newValues.splice(index, 1);
    setPropertyValue(newValues);
    setEditedIndex(undefined);
  }

  // TODO: This input is not finished. Still need to do some work to make it editable.
  // That is, edit existing values. And make it editable using only keyboard input...
  // But first, discuss alternative designs witht he team, before making it too complex
  return (
    <PillsInput
      disabled={disabled}
      onKeyUp={onKeyUp}
      onBlur={() => stopEditing()}
      label={<PropertyLabel label={name} tip={description} />}
    >
      <Pill.Group>
        {value.map((value, i) => (
          <Pill
            key={i}
            withRemoveButton={editedIndex === i}
            onRemove={() => deleteItem(i)}
            onClick={(event) => {
              setEditedIndex(i);
              event.currentTarget.focus();
            }}
          >
            {value}
          </Pill>
        ))}
        <PillsInput.Field
          value={editedIndex !== undefined ? value[editedIndex] : inputString}
          onChange={(event) => setInputString(event.currentTarget.value)}
          onKeyUp={(event) => onInputFieldKeyUp(event)}
        />
      </Pill.Group>
    </PillsInput>
  );
}
