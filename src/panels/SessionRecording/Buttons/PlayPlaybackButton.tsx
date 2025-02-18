import { Button, ButtonProps } from '@mantine/core';

import { PlayIcon } from '@/icons/icons';

interface Props extends ButtonProps {
  onClick: () => void;
}

export function PlayPlaybackButton({ onClick, ...props }: Props) {
  return (
    <Button onClick={onClick} leftSection={<PlayIcon />} variant={'light'} {...props}>
      Play
    </Button>
  );
}
