import { Button, ButtonProps } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { PlayIcon } from '@/icons/icons';

export function ResumePlaybackButton({ ...props }: ButtonProps) {
  const luaApi = useOpenSpaceApi();

  return (
    <Button
      onClick={() => luaApi?.sessionRecording.togglePlaybackPause()}
      leftSection={<PlayIcon />}
      color={'orange'}
      variant={'filled'}
      {...props}
    >
      Resume
    </Button>
  );
}
