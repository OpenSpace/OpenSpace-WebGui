import { useEffect, useRef, useState } from 'react';
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

  const [isEditing, setIsEditing] = useState(false);
  const [clickedItemIndex, setClickedItemIndex] = useState<number | undefined>(undefined);

  const inputFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setShownValues(value);
  }, [value]);

  useEffect(() => {
    const inputIsFocused = inputFieldRef.current === document.activeElement;
    if (inputIsFocused) {
      setPlaceholderText(placeholder(shownValues));
    }
  }, [shownValues]);

  function placeholder(values: string[]) {
    return `item${values.length + 1}, item${values.length + 2}, ...`;
  }

  function onInputKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      // Update values if enter is pressed
      const splitInput = inputString
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

      const newValues = [...shownValues, ...splitInput];
      setPropertyValue(newValues);
      setShownValues(newValues);
      stopEditing();
      if (newValues.length === 0) {
        event.currentTarget.blur();
      }
    } else if (!isEditing && event.key === 'Backspace') {
      // Edit old values if backspace is pressed and we are not currently editing
      setIsEditing(true);
      setInputString(value.join(', '));
      setShownValues([]);
    } else if (event.key === 'Escape') {
      // Stop editing and reset the input string
      stopEditing();
      event.currentTarget.blur();
    } else {
      // If any other key is pressed, we are editing
      setIsEditing(true);
    }
  }

  function stopEditing() {
    setInputString('');
    setIsEditing(false);
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
            key={`pill-${i}`}
            style={disabled ? {} : { cursor: 'pointer' }}
            withRemoveButton={clickedItemIndex === i}
            onRemove={() => deleteItem(i)}
            onClick={() => onItemClick(i)}
          >
            {v}
          </Pill>
        ))}
        <PillsInput.Field
          ref={inputFieldRef}
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
