import { useState } from 'react';
import { Group, TextInput, Title } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { BoolInput } from '@/components/Input/BoolInput';
import { useSubscribeToSessionRecording } from '@/hooks/topicSubscriptions';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateSessionRecordingSettings } from '@/redux/sessionrecording/sessionRecordingSlice';

import { RecordingStopButton } from './Record/RecordingStopButton';
import { RecordStartButton } from './Record/RecordStartButton';
import { RecordingState, SessionRecordingFormat } from './types';

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
  const fileNameIsValid = !filenameState.invalid;

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
    const asciiExtension = '.osrectxt';
    const binaryExtension = '.osrec';

    let lowerFileName = filename.toLowerCase();

    const hasExtension =
      lowerFileName.endsWith(asciiExtension) || lowerFileName.endsWith(binaryExtension);

    // Add the expected extension if it does not exist
    if (!hasExtension) {
      const expectedExtension = fileFormat === 'Ascii' ? asciiExtension : binaryExtension;
      lowerFileName = lowerFileName.concat(expectedExtension);
    }

    // Check if filename already exists
    return fileList.every((file) => file.toLowerCase() !== lowerFileName);
  }

  function onFilenameChanged(value: string): void {
    setFilenameRecording(value);

    // Remove any error messages if the input field is empty
    if (!value.trim()) {
      setFilenameState({ invalid: false, errorMessage: '' });
      return;
    }

    if (isFileUnique(value, format)) {
      dispatch(updateSessionRecordingSettings({ recordingFileName: value }));
      setFilenameState({ invalid: false, errorMessage: '' });
    } else {
      setFilenameState({ invalid: true, errorMessage: `File '${value}' already exists` });
    }
  }

  function onFormatChanged(useTextFormat: boolean): void {
    const newFormat: SessionRecordingFormat = useTextFormat ? 'Ascii' : 'Binary';
    dispatch(updateSessionRecordingSettings({ format: newFormat }));

    // The filename might be invalid if the format changes so we check it again
    if (isFileUnique(filenameRecording, newFormat)) {
      setFilenameState({ invalid: false, errorMessage: '' });
    } else {
      setFilenameState({
        invalid: true,
        errorMessage: `File '${filenameRecording}' already exists`
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
        disabled={fileNameIsValid}
        my={'sm'}
        info={`If you enter a filename that already exists, this checkbox allows you to
          overwrite the existing file.`}
      />
    </>
  );
}
