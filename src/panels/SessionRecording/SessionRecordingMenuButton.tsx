import { useEffect } from 'react';
import { ActionIcon, Button, Group } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { PauseIcon, PlayIcon, StopIcon, VideocamIcon } from '@/icons/icons';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  subscribeToSessionRecording,
  unsubscribeToSessionRecording
} from '@/redux/sessionrecording/sessionRecordingMiddleware';
import { IconSize } from '@/types/enums';
import { RecordingsFolderKey } from '@/util/keys';
import { RecordingState } from './types';

interface SessionRecMenuButtonProps {
  onClick: () => void;
}

export function SessionRecordingMenuButton({ onClick }: SessionRecMenuButtonProps) {
  const recordingState = useAppSelector((state) => state.sessionRecording.state);
  const { format, recordingFileName: fileName } = useAppSelector(
    (state) => state.sessionRecording.settings
  );
  const openspace = useOpenSpaceApi();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(subscribeToSessionRecording());
    //dispatch(subscribeToEngineMode()); // TODO: Add this from store
    return () => {
      dispatch(unsubscribeToSessionRecording());
    };
  }, [dispatch]);

  function togglePlaybackPaused() {
    openspace?.sessionRecording.togglePlaybackPause();
  }

  function stopRecording() {
    openspace?.sessionRecording.stopRecording(
      `${RecordingsFolderKey}${fileName}`,
      format
    );
  }

  function stopPlayback() {
    openspace?.sessionRecording.stopPlayback();
  }

  function renderMenuButtons() {
    switch (recordingState) {
      case RecordingState.Recording:
        return (
          <Button
            onClick={stopRecording}
            leftSection={<StopIcon />}
            color={'red'}
            size={'xl'}
          >
            Stop Recording
          </Button>
        );
      case RecordingState.Paused:
        return (
          <Group gap={0}>
            <Button
              onClick={togglePlaybackPaused}
              leftSection={<PlayIcon />}
              color={'orange'}
              size={'xl'}
            >
              Resume
            </Button>
            <Button
              onClick={stopPlayback}
              leftSection={<StopIcon />}
              color={'orange'}
              size={'xl'}
            >
              Stop Playback
            </Button>
          </Group>
        );
      case RecordingState.Playing:
        return (
          <Group gap={'xs'}>
            <Button
              onClick={togglePlaybackPaused}
              leftSection={<PauseIcon />}
              size={'xl'}
            >
              Pause
            </Button>
            <Button
              onClick={stopPlayback}
              leftSection={<StopIcon />}
              color={'red'}
              size={'xl'}
            >
              Stop Playback
            </Button>
          </Group>
        );
      default:
        return (
          <ActionIcon onClick={onClick} size={'input-xl'}>
            <VideocamIcon size={IconSize.lg} />
          </ActionIcon>
        );
    }
  }

  return renderMenuButtons();
}
