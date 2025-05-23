import { Button, ButtonProps } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { PlayIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';
import { RecordingsFolderKey } from '@/util/keys';

import { useShowGUI } from '../hooks';

interface Props extends ButtonProps {
  filename: string | null;
  loopPlayback: boolean;
  shouldOutputFrames: boolean;
  outputFramerate: number;
}

export function PlaybackPlayButton({
  filename,
  shouldOutputFrames,
  loopPlayback,
  outputFramerate,
  ...props
}: Props) {
  const { hideGuiOnPlayback } = useAppSelector(
    (state) => state.sessionRecording.settings
  );
  const luaApi = useOpenSpaceApi();
  const showGUI = useShowGUI();

  async function startPlayback(): Promise<void> {
    const shouldWaitForTiles = true;
    const filePath = await luaApi?.absPath(`${RecordingsFolderKey}${filename}`);
    if (!filePath) {
      // TODO anden88 2025-02-18: notification about error using mantine notification system?
      return;
    }

    if (hideGuiOnPlayback) {
      await showGUI(false);
    }

    if (shouldOutputFrames) {
      luaApi?.sessionRecording.startPlayback(
        filePath,
        loopPlayback,
        shouldWaitForTiles,
        outputFramerate
      );
    } else {
      luaApi?.sessionRecording.startPlayback(filePath, loopPlayback, shouldWaitForTiles);
    }
  }

  return (
    <Button onClick={startPlayback} leftSection={<PlayIcon />} {...props}>
      Play
    </Button>
  );
}
