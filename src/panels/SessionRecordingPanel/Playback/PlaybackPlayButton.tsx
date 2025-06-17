import { useTranslation } from 'react-i18next';
import { Button, ButtonProps } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { PlayIcon } from '@/icons/icons';
import { useAppDispatch } from '@/redux/hooks';
import { showGUI } from '@/redux/sessionrecording/sessionRecordingMiddleware';
import { RecordingsFolderKey } from '@/util/keys';

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
  const luaApi = useOpenSpaceApi();
  const { t } = useTranslation('panel-sessionrecording', { keyPrefix: 'button-labels' });
  const dispatch = useAppDispatch();

  async function startPlayback(): Promise<void> {
    const shouldWaitForTiles = true;
    const filePath = await luaApi?.absPath(`${RecordingsFolderKey}/${filename}`);
    if (!filePath) {
      // TODO anden88 2025-02-18: notification about error using mantine notification system?
      return;
    }

    dispatch(showGUI(false));

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
      {t('play')}
    </Button>
  );
}
