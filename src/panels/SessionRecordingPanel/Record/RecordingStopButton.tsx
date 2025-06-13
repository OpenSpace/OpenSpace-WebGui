import { useTranslation } from 'react-i18next';
import { Button, ButtonProps } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { StopIcon } from '@/icons/icons';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { handleNotificationLogging } from '@/redux/logging/loggingMiddleware';
import { updateSessionRecordingSettings } from '@/redux/sessionrecording/sessionRecordingSlice';
import { LogLevel } from '@/types/enums';
import { RecordingsFolderKey } from '@/util/keys';

import { sessionRecordingFilenameWithExtension } from '../util';

export function RecordingStopButton({ ...props }: ButtonProps) {
  const luaApi = useOpenSpaceApi();
  const { format, overwriteFile, recordingFilename } = useAppSelector(
    (state) => state.sessionRecording.settings
  );
  const { t } = useTranslation('panel-sessionrecording', {
    keyPrefix: 'recording-stop-button'
  });
  const dispatch = useAppDispatch();

  async function stopRecording(): Promise<void> {
    let file = recordingFilename.trim();
    file = sessionRecordingFilenameWithExtension(file, format);

    try {
      const filePath = await luaApi?.absPath(`${RecordingsFolderKey}/${file}`);

      if (filePath) {
        await luaApi?.sessionRecording.stopRecording(filePath, format, overwriteFile);
        dispatch(updateSessionRecordingSettings({ latestFile: file }));
      } else {
        dispatch(
          handleNotificationLogging(
            t('error-messages.title'),
            t('error-messages.invalid-filepath', { filepath: filePath, file: file }),
            LogLevel.Error
          )
        );
      }
    } catch (error) {
      dispatch(
        handleNotificationLogging(t('error-messages.title'), error, LogLevel.Error)
      );
    }
  }

  return (
    <Button
      onClick={stopRecording}
      leftSection={<StopIcon />}
      color={'red'}
      variant={'filled'}
      {...props}
    >
      {t('label')}
    </Button>
  );
}
