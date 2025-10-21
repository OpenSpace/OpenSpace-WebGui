import { ActionIcon, Group } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { PauseIcon, PlayIcon, StopIcon } from '@/icons/icons';

export function PlaybackControls() {
  const luaApi = useOpenSpaceApi();

  return (
    <Group my={'xs'} gap={'xs'}>
      <ActionIcon
        onClick={async () => {
          const isPlayback = await luaApi?.sessionRecording.isPlayingBack();
          if (isPlayback) {
            luaApi?.sessionRecording.setPlaybackPause(false);
          } else {
            luaApi?.keyframeRecording.play();
          }
        }}
      >
        <PlayIcon />
      </ActionIcon>
      <ActionIcon onClick={() => luaApi?.keyframeRecording.pause()}>
        <PauseIcon />
      </ActionIcon>
      <ActionIcon onClick={() => luaApi?.sessionRecording.stopPlayback()}>
        <StopIcon />
      </ActionIcon>
    </Group>
  );
}
