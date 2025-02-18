import { Button, ButtonProps } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { StopIcon } from '@/icons/icons';

export function StopPlaybackButton({ ...props }: ButtonProps) {
  const luaApi = useOpenSpaceApi();

  return (
    <Button
      onClick={() => luaApi?.sessionRecording.stopPlayback()}
      leftSection={<StopIcon />}
      color={'red'}
      variant={'filled'}
      {...props}
    >
      Stop Playback
    </Button>
  );
}
