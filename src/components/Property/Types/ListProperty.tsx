import { useState } from 'react';
import { IoSaveOutline } from 'react-icons/io5';
import { ActionIcon, ButtonGroup, Card, CloseButton, Grid, Group, InputLabel, List, Space, TextInput } from '@mantine/core';

import { Tooltip } from '@/components/Tooltip/Tooltip';

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
  const [editing, setEditing] = useState<boolean>(false);
  const [inputString, setInputString] = useState<string>("");
  const [listValues, setListValues] = useState<string[]>(value);

  function onAddKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
    const newItem = inputString.trim();
    if (event.key === 'Enter' && newItem.length > 0) {
      setListValues([newItem, ...listValues]);
      setInputString("");
    } else if (event.key === 'Escape') {
      stopEditing();
    }
  }

  function onEditKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      setPropertyValue(listValues);
      stopEditing();
    } else if (event.key === 'Escape') {
      stopEditing();
    }
  }

  function onItemDelete(index: number) {
    const newValues = [...listValues];
    newValues.splice(index, 1);
    setListValues(newValues);
  }

  function stopEditing() {
    setInputString("");
    setEditing(false);
  }

  function savePropertyChange() {
    setPropertyValue(listValues);
    stopEditing();
  }

  if (editing) {
    return (
      <>
        <Grid align='center'>
          <Grid.Col span="auto">
            <TextInput
              value={inputString}
              variant="filled"
              placeholder='Add new value'
              onChange={(event) => setInputString(event.currentTarget.value)}
              onKeyUp={(event) => onAddKeyUp(event)}
              label={
                <Group>
                  <InputLabel>{name}</InputLabel>
                  <Tooltip text={description} />
                </Group>
              }

            />
          </Grid.Col>
          <Grid.Col span="content">
            <ButtonGroup>
              <ActionIcon onClick={savePropertyChange}><IoSaveOutline /></ActionIcon>
              <Space w="sm" />
              <CloseButton onClick={stopEditing} />
              <Space w="sm" />
            </ButtonGroup>
          </Grid.Col>
        </Grid>
        <Card>
          <List>
            {listValues.length > 0 ?
              listValues.map((_, i) =>
                <TextInput
                  key={i}
                  value={listValues[i]}
                  onKeyUp={(event) => onEditKeyUp(event)}
                  rightSection={<CloseButton onClick={() => onItemDelete(i)} />}
                  onChange={(event) => {
                    const newValues = listValues.map((e, index) =>
                      (index === i) ? event.currentTarget.value : e
                    );
                    setListValues(newValues)
                  }}
                />)
              : <>List is empty</>}
          </List>
        </Card>
      </>);
  }
  return (
    <TextInput
      value={value}
      disabled={disabled}
      onFocus={() => {
        setEditing(true)
        setListValues(value)
      }}
      onChange={() => { }}
      label={
        <Group>
          <InputLabel>{name}</InputLabel>
          <Tooltip text={description} />
        </Group>
      }
    />
  );
}
