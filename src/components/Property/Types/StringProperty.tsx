import { useState } from 'react';
import { Group, InputLabel, TextInput } from '@mantine/core';

import { Tooltip } from '@/components/Tooltip/Tooltip';

interface Props {
  name: string;
  description: string;
  disabled: boolean;
  setPropertyValue: (newValue: string) => void;
  value: string;
}

// TODO: The text edit that sets value on enter should be a more general component
export function StringProperty({
  name,
  description,
  disabled,
  setPropertyValue,
  value
}: Props) {
  const [currentValue, setCurrentValue] = useState<string>(value);

  function onKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      setPropertyValue(currentValue);
      event.currentTarget.blur();
    } else if (event.key === 'Escape') {
      setCurrentValue(value);
      event.currentTarget.blur();
    }
  }

  return (
    <TextInput
      value={currentValue}
      onChange={(event) => setCurrentValue(event.currentTarget.value)}
      onKeyUp={(event) => onKeyUp(event)}
      disabled={disabled}
      label={
        <Group>
          <InputLabel>{name}</InputLabel>
          <Tooltip text={description} />
        </Group>
      }
    />
  );
}
