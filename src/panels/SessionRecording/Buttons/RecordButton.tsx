import { Button, ButtonProps } from '@mantine/core';

import { RecordIcon } from '@/icons/icons';

interface Props extends ButtonProps {
  onClick: () => void;
}

export function RecordButton({ onClick, ...props }: Props) {
  return (
    <Button onClick={onClick} leftSection={<RecordIcon />} variant={'light'} {...props}>
      Record
    </Button>
  );
}
