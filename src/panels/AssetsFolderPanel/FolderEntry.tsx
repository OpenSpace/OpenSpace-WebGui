import { Button } from '@mantine/core';

import { TruncatedText } from '@/components/TruncatedText/TruncatedText';
import { FolderIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';

interface Props {
  text: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  icon?: React.ReactNode;
}

export function FolderEntry({ text, onClick, icon }: Props) {
  return (
    <Button
      leftSection={icon ?? <FolderIcon size={IconSize.sm} />}
      onClick={onClick}
      variant={'subtle'}
      fullWidth
      justify={'left'}
      size={'compact-sm'}
      mb={3}
      color={'gray'}
    >
      <TruncatedText>{text}</TruncatedText>
    </Button>
  );
}
