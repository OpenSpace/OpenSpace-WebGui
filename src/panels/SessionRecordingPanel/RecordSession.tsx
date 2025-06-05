import { useState } from 'react';
import { Group, TextInput, Title, Tooltip } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { BoolInput } from '@/components/Input/BoolInput';
import { useSubscribeToSessionRecording } from '@/hooks/topicSubscriptions';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateSessionRecordingSettings } from '@/redux/sessionrecording/sessionRecordingSlice';

import { RecordingStopButton } from './Record/RecordingStopButton';
import { RecordStartButton } from './Record/RecordStartButton';
import { RecordingState, SessionRecordingFormat } from './types';
import { sessionRecordingFilenameWithExtension } from './util';

export function RecordSession() {
  const [filenameRecording, setFilenameRecording] = useState('');
  const [filenameState, setFilenameState] = useState({
    invalid: false,
    errorMessage: ''
  });

  const fileList = useAppSelector((state) => state.sessionRecording.files);
  const { overwriteFile, format } = useAppSelector(
    (state) => state.sessionRecording.settings
  );

  const recordingState = useSubscribeToSessionRecording();
  const luaApi = useOpenSpaceApi();
  const dispatch = useAppDispatch();

  const isIdle = recordingState === RecordingState.Idle;
  const isRecordingState = recordingState === RecordingState.Recording;
  const isValidFileName = !filenameState.invalid;

  function startRecording(): void {
    if (filenameRecording === '') {
      setFilenameState({ invalid: true, errorMessage: 'Filename cannot be empty' });
      return;
    }

    if (!overwriteFile && !isFileUnique(filenameRecording, format)) {
      setFilenameState({ invalid: true, errorMessage: 'Filename already exists' });
      return;
    }

    luaApi?.sessionRecording.startRecording();
  }

  function isFileUnique(filename: string, fileFormat: SessionRecordingFormat): boolean {
    const lowerCaseFilename = sessionRecordingFilenameWithExtension(filename, fileFormat);

    // Check if filename already exists
    return fileList.every((file) => file.toLowerCase() !== lowerCaseFilename);
  }

  function onFilenameChanged(value: string): void {
    setFilenameRecording(value);

    // Remove any error messages if the input field is empty
    if (value.trim() === '') {
      setFilenameState({ invalid: false, errorMessage: '' });
      return;
    }

    if (isFileUnique(value, format)) {
      dispatch(updateSessionRecordingSettings({ recordingFilename: value }));
      setFilenameState({ invalid: false, errorMessage: '' });
    } else {
      const valueWithExtension = sessionRecordingFilenameWithExtension(value, format);
      setFilenameState({
        invalid: true,
        errorMessage: `File '${valueWithExtension}' already exists`
      });
    }
  }

  function onFormatChanged(useTextFormat: boolean): void {
    const newFormat: SessionRecordingFormat = useTextFormat ? 'Ascii' : 'Binary';
    dispatch(updateSessionRecordingSettings({ format: newFormat }));

    // The filename might be invalid if the format changes so we check it again
    if (isFileUnique(filenameRecording, newFormat)) {
      setFilenameState({ invalid: false, errorMessage: '' });
    } else {
      const fileWithExtension = sessionRecordingFilenameWithExtension(
        filenameRecording,
        newFormat
      );

      setFilenameState({
        invalid: true,
        errorMessage: `File '${fileWithExtension}' already exists`
      });
    }
  }

  function onOverwriteFileChanged(value: boolean): void {
    dispatch(updateSessionRecordingSettings({ overwriteFile: value }));
  }

  return (
    <>
      <Title order={2} mb={'xs'}>
        Record
      </Title>
      <BoolInput
        value={format === 'Ascii'}
        label={'Use text file format'}
        onChange={onFormatChanged}
        mb={'sm'}
      />
      <Group align={'start'} gap={'xs'}>
        <Tooltip
          label={
            'Automatically adds the correct file extension based on the selected file format'
          }
        >
          <TextInput
            value={filenameRecording}
            placeholder={'Enter recording filename'}
            aria-label={'Enter recording filename'}
            onChange={(event) => onFilenameChanged(event.currentTarget.value)}
            error={filenameState.invalid && filenameState.errorMessage}
            disabled={!isIdle}
          />
        </Tooltip>
        {isRecordingState ? (
          <RecordingStopButton />
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
        disabled={isValidFileName}
        my={'sm'}
        info={`If you enter a filename that already exists, this checkbox allows you to
          overwrite the existing file.`}
      />
    </>
  );
}
