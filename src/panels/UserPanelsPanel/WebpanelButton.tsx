import { Button, Text } from '@mantine/core';

import { OpenWindowIcon } from '@/icons/icons';

interface Props {
  title: string;
  src: string;
  onClick: (title: string, src: string) => void;
}

export function WebPanelButton({ title, src, onClick }: Props) {
  return (
    <Button onClick={() => onClick(title, src)} fullWidth mb={'xs'}>
      <Text m={'xs'}>{title}</Text>
      <OpenWindowIcon />
    </Button>
  );
}
