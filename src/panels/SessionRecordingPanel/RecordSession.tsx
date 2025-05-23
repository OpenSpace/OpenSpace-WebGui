import { useState } from 'react';
import { Group, TextInput, Title } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { BoolInput } from '@/components/Input/BoolInput';
import { useSubscribeToSessionRecording } from '@/hooks/topicSubscriptions';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateSessionRecordingSettings } from '@/redux/sessionrecording/sessionRecordingSlice';

import { RecordingStopButton } from './Record/RecordingStopButton';
import { RecordStartButton } from './Record/RecordStartButton';
import { RecordingState } from './types';

export function RecordSession() {
  const [filenameRecording, setFilenameRecording] = useState('');
  const [filenameState, setFilenameState] = useState({
    invalid: false,
    errorMessage: ''
  });

  const dispatch = useAppDispatch();
  const fileList = useAppSelector((state) => state.sessionRecording.files);
  const { overwriteFile } = useAppSelector((state) => state.sessionRecording.settings);
  const [showOverwriteCheckbox, setShowOverwriteCheckbox] = useState(overwriteFile);

  const recordingState = useSubscribeToSessionRecording();
  const luaApi = useOpenSpaceApi();

  const isIdle = recordingState === RecordingState.Idle;
  const isRecordingState = recordingState === RecordingState.Recording;

  function startRecording(): void {
    if (filenameRecording === '') {
      setFilenameState({
        invalid: true,
        errorMessage: 'Filename cannot be empty'
      });
      setShowOverwriteCheckbox(false);
      return;
    }

    if (!overwriteFile && !isFileUnique(filenameRecording)) {
      setFilenameState({
        invalid: true,
        errorMessage: 'Filename already exists'
      });
      setShowOverwriteCheckbox(true);
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
      setFilenameState({
        invalid: false,
        errorMessage: ''
      });
      setShowOverwriteCheckbox(false);
      return;
    }

    if (isFileUnique(value)) {
      dispatch(updateSessionRecordingSettings({ recordingFileName: value }));
      setFilenameState({
        invalid: false,
        errorMessage: ''
      });
      setShowOverwriteCheckbox(false);
    } else {
      setFilenameState({
        invalid: true,
        errorMessage: `File '${value}' already exists`
      });
      setShowOverwriteCheckbox(true);
    }
  }

  function onFormatChanged(useTextFormat: boolean): void {
    const _format = useTextFormat ? 'Ascii' : 'Binary';
    updateSessionRecordingSettings({ format: _format });
  }

  function onOverwriteFileChanged(value: boolean): void {
    dispatch(
      updateSessionRecordingSettings({
        overwriteFile: value
      })
    );
  }

  return (
    <>
      <Title order={2} mb={'xs'}>
        Record
      </Title>
      <BoolInput label={'Use text file format'} onChange={onFormatChanged} mb={'sm'} />
      <Group align={'start'} gap={'xs'}>
        <TextInput
          value={filenameRecording}
          placeholder={'Enter recording filename'}
          aria-label={'Enter recording filename'}
          onChange={(event) => onFilenameChanged(event.currentTarget.value)}
          error={filenameState.invalid && filenameState.errorMessage}
          disabled={!isIdle}
        />
        {isRecordingState ? (
          <RecordingStopButton filename={filenameRecording} />
        ) : (
          <RecordStartButton
            onClick={startRecording}
            disabled={(!overwriteFile && filenameState.invalid) || !isIdle}
          />
        )}
      </Group>
      <BoolInput
        label={'Overwrite file'}
        value={overwriteFile}
        onChange={onOverwriteFileChanged}
        disabled={!showOverwriteCheckbox}
        my={'sm'}
        info={`If you enter a filename that already exists, this checkbox allows you to
          overwrite the existing file.`}
      />
    </>
  );
}
