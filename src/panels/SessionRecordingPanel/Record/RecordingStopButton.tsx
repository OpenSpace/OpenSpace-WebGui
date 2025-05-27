import { Button, ButtonProps } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { StopIcon } from '@/icons/icons';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { handleNotificationLogging } from '@/redux/logging/loggingMiddleware';
import { updateSessionRecordingSettings } from '@/redux/sessionrecording/sessionRecordingSlice';
import { LogLevel } from '@/types/enums';
import { RecordingsFolderKey } from '@/util/keys';

interface Props extends ButtonProps {
  filename: string;
}

export function RecordingStopButton({ filename, ...props }: Props) {
  const luaApi = useOpenSpaceApi();
  const { format, overwriteFile } = useAppSelector(
    (state) => state.sessionRecording.settings
  );
  const dispatch = useAppDispatch();

  async function stopRecording(): Promise<void> {
    let file = filename.trim();
    const extension = format === 'Ascii' ? '.osrectxt' : '.osrec';
    const index = file.lastIndexOf('.');
    const hasExtension = index !== -1;

    if (hasExtension) {
      const fileExtension = filename.substring(index);
      if (fileExtension !== extension) {
        file = filename.concat(extension);
      }
    } else {
      file = filename.concat(extension);
    }

    try {
      const filePath = await luaApi?.absPath(`${RecordingsFolderKey}${file}`);
      if (filePath) {
        await luaApi?.sessionRecording.stopRecording(filePath, format, overwriteFile);
        dispatch(updateSessionRecordingSettings({ latestFile: file }));
      } else {
        dispatch(
          handleNotificationLogging(
            'Error stopping session recording',
            `Invalid filepath, can't find filepath '${filePath}' for file: '${file}'`,
            LogLevel.Error
          )
        );
      }
    } catch (error) {
      dispatch(
        handleNotificationLogging(
          'Error stopping session recording',
          error,
          LogLevel.Error
        )
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
      Stop Recording
    </Button>
  );
}
