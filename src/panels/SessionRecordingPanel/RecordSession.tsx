import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('panel-sessionrecording', { keyPrefix: 'record-session' });
  const dispatch = useAppDispatch();

  const isIdle = recordingState === RecordingState.Idle;
  const isRecordingState = recordingState === RecordingState.Recording;
  const isValidFilename = !filenameState.invalid;

  function startRecording(): void {
    if (filenameRecording === '') {
      setFilenameState({
        invalid: true,
        errorMessage: t('error-messages.empty-filename')
      });
      return;
    }

    if (!overwriteFile && !isFileUnique(filenameRecording, format)) {
      setFilenameState({
        invalid: true,
        errorMessage: t('error-messages.duplicate', { filename: filenameRecording })
      });
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
        errorMessage: t('error-messages.duplicate', { filename: valueWithExtension })
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
        errorMessage: t('error-messages.duplicate', { filename: fileWithExtension })
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
        label={t('format-checkbox-label')}
        onChange={onFormatChanged}
        mb={'sm'}
      />
      <Group align={'start'} gap={'xs'}>
        <Tooltip label={t('filename-input.tooltip')}>
          <TextInput
            value={filenameRecording}
            placeholder={t('filename-input.aria-label')}
            aria-label={t('filename-input.aria-label')}
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
        label={t('overwrite-file.label')}
        value={overwriteFile}
        onChange={onOverwriteFileChanged}
        disabled={isValidFilename}
        my={'sm'}
        info={t('overwrite-file.tooltip')}
      />
    </>
  );
}
