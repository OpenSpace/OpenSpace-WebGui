import { Button, ButtonProps } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { StopIcon } from '@/icons/icons';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateSessionRecordingSettings } from '@/redux/sessionrecording/sessionRecordingSlice';
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

  function stopRecording(): void {
    const extension = format === 'Ascii' ? '.osrectxt' : '.osrec';
    const index = filename.lastIndexOf('.');
    const hasExtension = index !== -1;

    if (hasExtension) {
      const fileExtension = filename.substring(index);
      if (fileExtension !== extension) {
        filename = filename.concat(extension);
      }
    } else {
      filename = filename.concat(extension);
    }

    // prettier-ignore
    luaApi?.absPath(`${RecordingsFolderKey}${filename}`)
          .then((value) => luaApi?.sessionRecording.stopRecording(value, format, overwriteFile));
    dispatch(updateSessionRecordingSettings({ latestFile: filename }));
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
