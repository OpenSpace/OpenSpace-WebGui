import { useMemo, useState } from 'react';
import { Pill, PillsInput } from '@mantine/core';

import { usePropListeningState } from '@/api/hooks';

import { ConcretePropertyBaseProps } from '../../types';

type ListValueType = string | number;

export interface ListPropertyProps extends ConcretePropertyBaseProps {
  setPropertyValue: (newValue: ListValueType[]) => void;
  value: ListValueType[];
}

interface Props extends ListPropertyProps {
  valueType: 'string' | 'int' | 'float';
}

export function ListProperty({
  name,
  disabled,
  setPropertyValue,
  value,
  valueType
}: Props) {
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
      onBlur={stopEditing}
      aria-label={`List input for ${name}`}
    >
      <Pill.Group mah={100} style={{ overflowY: 'auto' }}>
        {shownValues.map((item, i) => (
          <Pill
            key={`pill-${i}`}
            style={disabled ? {} : { cursor: 'pointer' }}
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
