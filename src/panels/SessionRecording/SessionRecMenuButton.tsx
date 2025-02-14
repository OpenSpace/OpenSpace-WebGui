import { useEffect } from 'react';
import { ActionIcon, Button, Group } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { PauseIcon, PlayIcon, StopIcon, VideocamIcon } from '@/icons/icons';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  subscribeToSessionRecording,
  unsubscribeToSessionRecording
} from '@/redux/sessionrecording/sessionRecordingMiddleware';
import { RecordingState } from '@/redux/sessionrecording/sessionRecordingSlice';
import { IconSize } from '@/types/enums';

interface SessionRecMenuButtonProps {
  onClick: () => void;
}

export function SessionRecMenuButton({ onClick }: SessionRecMenuButtonProps) {
  const recordingState = useAppSelector((state) => state.sessionRecording.state);
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
    openspace?.sessionRecording.stopRecording();
  }

  function stopPlayback() {
    openspace?.sessionRecording.stopPlayback();
  }

  function renderMenuButtons() {
    switch (recordingState) {
      case RecordingState.recording:
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
      case RecordingState.paused:
        return (
          <Group gap={'xs'}>
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
      case RecordingState.playing:
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
          <ActionIcon onClick={onClick} variant={'taskbar'} size={'input-xl'}>
            <VideocamIcon size={IconSize.lg} />
          </ActionIcon>
        );
    }
  }

  return renderMenuButtons();
}
