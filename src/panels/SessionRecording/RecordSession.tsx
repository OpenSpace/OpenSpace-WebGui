import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateSessionRecordingSettings } from '@/redux/sessionrecording/sessionRecordingSlice';
import { Button, Checkbox, Group, TextInput, Title } from '@mantine/core';
import { useState } from 'react';
import { RecordingState } from './types';
import { useOpenSpaceApi, useSubscribeToSessionRecording } from '@/api/hooks';
import { RecordingsFolderKey } from '@/util/keys';
import { RecordIcon, VideocamIcon } from '@/icons/icons';

export function RecordSession() {
  const [filenameRecording, setFilenameRecording] = useState('');
  const [invalidFileName, setInvalidFilename] = useState(false);

  const recordingState = useSubscribeToSessionRecording();
  const luaApi = useOpenSpaceApi();

  const dispatch = useAppDispatch();
  const fileList = useAppSelector((state) => state.sessionRecording.files);
  const { format } = useAppSelector((state) => state.sessionRecording.settings);

  function toggleFormat(useTextFormat: boolean): void {
    const _format = useTextFormat ? 'Ascii' : 'Binary';
    updateSessionRecordingSettings({ format: _format });
  }

  function isIdle() {
    return recordingState === RecordingState.Idle;
  }

  function toggleRecording(): void {
    if (isIdle()) {
      startRecording();
    } else {
      stopRecording();
    }
  }

  function startRecording(): void {
    luaApi?.sessionRecording.startRecording();
  }

  function stopRecording(): void {
    // prettier-ignore
    luaApi?.absPath(`${RecordingsFolderKey}${filenameRecording}`)
      .then((value) => luaApi?.sessionRecording.stopRecording(value, format));
  }

  function onFilenameChanged(value: string): void {
    setFilenameRecording(value);

    // Check if filename already exists
    const isFileUnique = fileList.every((file) => {
      // Remove file extension
      const index = file.lastIndexOf('.');
      const filename = index !== -1 ? file.substring(0, index) : file;
      return filename !== value;
    });

    if (isFileUnique) {
      dispatch(updateSessionRecordingSettings({ recordingFileName: value }));
    }
    setInvalidFilename(!isFileUnique);
  }

  function recordButtonStateProperties(): {
    text: string;
    color: string | undefined;
    icon: React.JSX.Element;
  } {
    switch (recordingState) {
      case RecordingState.Recording:
        return { text: 'Stop Recording', color: 'red', icon: <VideocamIcon /> };
      default:
        // Use default color
        return { text: 'Record', color: undefined, icon: <RecordIcon /> };
    }
  }

  const recordButtonProps = recordButtonStateProperties();

  return (
    <>
      <Title order={2}>Record Session</Title>
      <Checkbox
        label={'Text file format'}
        onChange={(event) => toggleFormat(event.currentTarget.checked)}
        mb={'sm'}
      ></Checkbox>
      <Group>
        <TextInput
          value={filenameRecording}
          placeholder={'Enter recording filename'}
          aria-label={'Enter recording filename'}
          onChange={(event) => onFilenameChanged(event.currentTarget.value)}
          error={invalidFileName && `File '${filenameRecording}' already exists`}
        />
        <Button
          onClick={toggleRecording}
          leftSection={recordButtonProps.icon}
          disabled={invalidFileName}
          color={recordButtonProps.color}
        >
          {recordButtonProps.text}
        </Button>
      </Group>
    </>
  );
}
