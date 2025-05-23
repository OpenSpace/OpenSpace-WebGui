import { Button, ButtonProps } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { StopIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';

import { useShowGUI } from '../hooks';

export function PlaybackStopButton({ ...props }: ButtonProps) {
  const { hideGuiOnPlayback } = useAppSelector(
    (state) => state.sessionRecording.settings
  );
  const luaApi = useOpenSpaceApi();
  const showGUI = useShowGUI();

  function stopPlayback() {
    luaApi?.sessionRecording.stopPlayback();
    // If we hid the GUI we when playback we need to restore the value
    if (hideGuiOnPlayback) {
      showGUI(true);
    }
  }

  return (
    <Button
      onClick={stopPlayback}
      leftSection={<StopIcon />}
      color={'red'}
      variant={'filled'}
      {...props}
    >
      Stop Playback
    </Button>
  );
}
