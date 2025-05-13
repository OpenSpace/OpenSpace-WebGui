import { Button, Text } from '@mantine/core';

import { KeybindInfoType } from '@/types/types';

import { KeybindButtons } from './KeybindButtons';

interface Props {
  keybind: KeybindInfoType;
  onClick: () => void;
  isSelected: boolean;
}

export function KeybindListEntry({ keybind, onClick, isSelected }: Props) {
  return (
    <Button
      onClick={onClick}
      size={'md'}
      variant={isSelected ? 'filled' : 'light'}
      fullWidth
      rightSection={
        <KeybindButtons modifiers={keybind.modifiers} selectedKey={keybind.key} />
      }
      justify={'space-between'}
    >
      <Text truncate>{keybind.name}</Text>
    </Button>
  );
}
