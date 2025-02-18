import { useState } from 'react';
import { Checkbox, Group, TextInput, Title } from '@mantine/core';

import { useOpenSpaceApi, useSubscribeToSessionRecording } from '@/api/hooks';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateSessionRecordingSettings } from '@/redux/sessionrecording/sessionRecordingSlice';

import { RecordButton } from './Buttons/RecordButton';
import { StopRecordingButton } from './Buttons/StopRecordingButton';
import { RecordingState } from './types';

export function RecordSession() {
  const [filenameRecording, setFilenameRecording] = useState('');
  const [filenameState, setFilenameState] = useState({
    invalid: false,
    errorMessage: ''
  });

  const recordingState = useSubscribeToSessionRecording();
  const luaApi = useOpenSpaceApi();

  const dispatch = useAppDispatch();
  const fileList = useAppSelector((state) => state.sessionRecording.files);

  function isIdle(): boolean {
    return recordingState === RecordingState.Idle;
  }

  function isRecordingState(): boolean {
    return (
      recordingState === RecordingState.Idle ||
      recordingState === RecordingState.Recording
    );
  }

  function startRecording(): void {
    if (filenameRecording === '') {
      setFilenameState({ invalid: true, errorMessage: 'Filename cannot be empty' });
      return;
    }
    if (!isFileUnique(filenameRecording)) {
      setFilenameState({ invalid: true, errorMessage: 'Filename already exists' });
      return;
    }
    luaApi?.sessionRecording.startRecording();
  }

  function isFileUnique(filename: string): boolean {
    // Check if filename already exists
    return fileList.every((file) => {
      // Remove file extension
      const index = file.lastIndexOf('.');
      const existingFilename = index !== -1 ? file.substring(0, index) : file;
      return existingFilename.toLowerCase() !== filename.toLowerCase();
    });
  }

  function onFilenameChanged(value: string): void {
    setFilenameRecording(value);

    if (!value.trim()) {
      setFilenameState({ invalid: true, errorMessage: 'Filename cannot be empty' });
      return;
    }

    if (isFileUnique(value)) {
      dispatch(updateSessionRecordingSettings({ recordingFileName: value }));
      setFilenameState({ invalid: false, errorMessage: '' });
    } else {
      setFilenameState({ invalid: true, errorMessage: `File '${value}' already exists` });
    }
  }

  function onFormatChanged(useTextFormat: boolean): void {
    const _format = useTextFormat ? 'Ascii' : 'Binary';
    updateSessionRecordingSettings({ format: _format });
  }

  return (
    <>
      <Title order={2}>Record Session</Title>
      <Checkbox
        label={'Text file format'}
        onChange={(event) => onFormatChanged(event.currentTarget.checked)}
        mb={'sm'}
      ></Checkbox>
      <Group align={'start'}>
        <TextInput
          value={filenameRecording}
          placeholder={'Enter recording filename'}
          aria-label={'Enter recording filename'}
          onChange={(event) => onFilenameChanged(event.currentTarget.value)}
          error={filenameState.invalid && filenameState.errorMessage}
          disabled={!isIdle()}
        />
        {recordingState !== RecordingState.Recording ? (
          <RecordButton
            onClick={startRecording}
            disabled={filenameState.invalid || !isRecordingState()}
          />
        ) : (
          <StopRecordingButton filename={filenameRecording} />
        )}
      </Group>
    </>
  );
}
