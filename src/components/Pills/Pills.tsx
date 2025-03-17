import { useState } from 'react';
import { Pill, PillsInput } from '@mantine/core';
import { usePropListeningState } from '@/api/hooks';

interface Props {
  value: string[];
  setValue: (value: string[]) => void;
  placeHolderText: string;
  isDisabled: boolean;
}

export function Pills({ value, setValue, placeHolderText, isDisabled }: Props) {
  const [clickedItemIndex, setClickedItemIndex] = useState<number | undefined>(undefined);
  const [placeholder, setPlaceholder] = useState('');
  const [inputString, setInputString] = useState('');

  // The values to shown as a list of pills in the input.
  const {
    value: shownValues,
    setValue: setShownValues,
    isEditing,
    setIsEditing
  } = usePropListeningState(value);

  function onInputKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
    const shouldEditOnBackSpace =
      (!isEditing || inputString.length === 0) && !(shownValues.length === 0);
    if (event.key === 'Enter') {
      const inputValues = inputString
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item !== '');
      const newValues = [...shownValues, ...inputValues];
      setShownValues(newValues);
      setValue(newValues);
      stopEditing();
      if (newValues.length === 0) {
        event.currentTarget.blur();
      }
    } else if (shouldEditOnBackSpace && event.key === 'Backspace') {
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

    setValue(newValues);
    setShownValues(newValues);

    setClickedItemIndex(undefined);
  }

  function onItemClick(index: number) {
    if (isDisabled) {
      return;
    }
    const isCurrent = clickedItemIndex === index;
    setClickedItemIndex(isCurrent ? undefined : index);
  }

  return (
    <PillsInput
      disabled={isDisabled}
      onBlur={stopEditing}
      aria-label={`List input for ${name}`}
    >
      <Pill.Group mah={100} style={{ overflowY: 'auto' }}>
        {shownValues.map((item, i) => (
          <Pill
            key={`pill-${i}`}
            style={isDisabled ? {} : { cursor: 'pointer' }}
            withRemoveButton={clickedItemIndex === i}
            onRemove={() => deleteItem(i)}
            onClick={() => onItemClick(i)}
          >
            {item}
          </Pill>
        ))}
        <PillsInput.Field
          placeholder={placeholder}
          value={inputString}
          onFocus={() => setPlaceholder(placeHolderText)}
          onBlur={() => setPlaceholder('')}
          onChange={(event) => setInputString(event.currentTarget.value)}
          onKeyUp={(event) => onInputKeyUp(event)}
        />
      </Pill.Group>
    </PillsInput>
  );
}
