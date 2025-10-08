import { Button } from '@mantine/core';

import { TruncatedText } from '@/components/TruncatedText/TruncatedText';
import { FolderIcon } from '@/icons/icons';

interface Props {
  text: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export function FolderEntry({ text, onClick }: Props) {
  return (
    <Button
      leftSection={<FolderIcon />}
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
