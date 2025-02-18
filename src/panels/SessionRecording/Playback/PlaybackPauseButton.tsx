import { Button, ButtonProps } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { PauseIcon } from '@/icons/icons';

export function PlaybackPauseButton({ ...props }: ButtonProps) {
  const luaApi = useOpenSpaceApi();

  return (
    <Button
      onClick={() => luaApi?.sessionRecording.togglePlaybackPause()}
      leftSection={<PauseIcon />}
      variant={'filled'}
      {...props}
    >
      Pause
    </Button>
  );
}
