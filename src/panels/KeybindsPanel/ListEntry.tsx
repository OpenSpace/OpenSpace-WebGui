import { Button } from '@mantine/core';

import { TruncatedText } from '@/components/TruncatedText/TruncatedText';
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
      <TruncatedText>{keybind.name}</TruncatedText>
    </Button>
  );
}
