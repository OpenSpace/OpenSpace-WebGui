import { ActionIcon, Button, Group } from '@mantine/core';

import { useOpenSpaceApi, useSubscribeToSessionRecording } from '@/api/hooks';
import { PauseIcon, PlayIcon, StopIcon, VideocamIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';

import { IconSize } from '@/types/enums';
import { RecordingsFolderKey } from '@/util/keys';

import { RecordingState } from './types';

interface SessionRecMenuButtonProps {
  onClick: () => void;
}

export function SessionRecordingMenuButton({ onClick }: SessionRecMenuButtonProps) {
  const recordingState = useSubscribeToSessionRecording();
  const openspace = useOpenSpaceApi();

  const { format, recordingFileName: fileName } = useAppSelector(
    (state) => state.sessionRecording.settings
  );

  function togglePlaybackPaused() {
    openspace?.sessionRecording.togglePlaybackPause();
  }

  function stopRecording() {
    // prettier-ignore
    openspace
      ?.absPath(`${RecordingsFolderKey}${fileName}`)
      .then((value) => openspace?.sessionRecording.stopRecording(value, format));
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
            variant={'light'}
            size={'xl'}
          >
            Stop Recording
          </Button>
        );
      case RecordingState.Paused:
        return (
          <Group gap={2}>
            <Button
              onClick={togglePlaybackPaused}
              leftSection={<PlayIcon />}
              variant={'light'}
              color={'orange'}
              size={'xl'}
            >
              Resume
            </Button>
            <Button
              onClick={stopPlayback}
              leftSection={<StopIcon />}
              color={'red'}
              variant={'light'}
              size={'xl'}
            >
              Stop Playback
            </Button>
          </Group>
        );
      case RecordingState.Playing:
        return (
          <Group gap={2}>
            <Button
              onClick={togglePlaybackPaused}
              leftSection={<PauseIcon />}
              size={'xl'}
              variant={'light'}
            >
              Pause
            </Button>
            <Button
              onClick={stopPlayback}
              leftSection={<StopIcon />}
              color={'red'}
              variant={'light'}
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
