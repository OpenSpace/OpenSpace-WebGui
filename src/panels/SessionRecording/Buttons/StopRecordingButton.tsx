import { Button, ButtonProps } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { StopIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';
import { RecordingsFolderKey } from '@/util/keys';

interface Props extends ButtonProps {
  filename: string;
}

export function StopRecordingButton({ filename, ...props }: Props) {
  const luaApi = useOpenSpaceApi();
  const format = useAppSelector((state) => state.sessionRecording.settings.format);

  function stopRecording(): void {
    // prettier-ignore
    luaApi?.absPath(`${RecordingsFolderKey}${filename}`)
          .then((value) => luaApi?.sessionRecording.stopRecording(value, format));
  }

  return (
    <Button
      onClick={stopRecording}
      leftSection={<StopIcon />}
      color={"red"}
      variant={"light"}
      {...props}
    >
      Stop Recording
    </Button>
  );
}
