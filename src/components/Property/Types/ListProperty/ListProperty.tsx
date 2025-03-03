import { useEffect, useMemo, useRef, useState } from 'react';
import { Pill, PillsInput } from '@mantine/core';

import { PropertyLabel } from '@/components/Property/PropertyLabel';

type ListValueType = string | number;

export interface ListPropertyProps {
  name: string;
  description: string;
  disabled: boolean;
  setPropertyValue: (newValue: ListValueType[]) => void;
  value: ListValueType[];
}

interface Props extends ListPropertyProps {
  valueType?: 'string' | 'int' | 'float';
}

export function ListProperty({
  name,
  description,
  disabled,
  setPropertyValue,
  value,
  valueType = 'string'
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

  const placeHolderText = useMemo(() => {
    switch (valueType) {
      case 'float':
        return `number1, number2, ...`;
      case 'int':
        return `integer1, integer2, ...`;
      case 'string':
        return `item1, item2, ...`;
      default:
        throw new Error('Invalid value type');
    }
  }, [valueType]);

  useEffect(() => {
    const inputIsFocused = inputFieldRef.current === document.activeElement;
    if (inputIsFocused) {
      setPlaceholderText(placeHolderText);
    }
  }, [placeHolderText]);

  function parseInput(input: string): ListValueType[] {
    const splitInput = input
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item !== '');

    switch (valueType) {
      case 'float':
        return splitInput.map((item) => parseFloat(item)).filter((item) => !isNaN(item));
      case 'int':
        return splitInput.map((item) => parseInt(item)).filter((item) => !isNaN(item));
      case 'string':
        return splitInput;
      default:
        throw new Error('Invalid value type');
    }
  }

  function onInputKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
    const shouldEditOnBackSpace =
      (!isEditing || inputString.length === 0) && !(shownValues.length === 0);

    if (event.key === 'Enter') {
      const inputValues = parseInput(inputString);
      const newValues = [...shownValues, ...inputValues];
      setShownValues(newValues);
      setPropertyValue(newValues);
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
      label={<PropertyLabel label={name} tip={description} isReadOnly={disabled} />}
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
          onFocus={() => setPlaceholderText(placeHolderText)}
          onBlur={() => setPlaceholderText('')}
          onChange={(event) => setInputString(event.currentTarget.value)}
          onKeyUp={(event) => onInputKeyUp(event)}
        />
      </Pill.Group>
    </PillsInput>
  );
}
