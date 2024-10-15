import { MdPause, MdPlayArrow, MdStop } from 'react-icons/md';
import { Button, Group } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { useAppSelector } from '@/redux/hooks';
import { RecordingState } from '@/redux/sessionrecording/sessionRecordingSlice';

interface SessionRecMenuButtonProps {
  onClick: () => void;
}

export function SessionRecMenuButton({ onClick }: SessionRecMenuButtonProps) {
  const recordingState = useAppSelector((state) => state.sessionRecording.state);
  const openspace = useOpenSpaceApi();

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
            leftSection={<MdStop />}
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
              leftSection={<MdPlayArrow />}
              color={'orange'}
              size={'xl'}
            >
              Resume
            </Button>
            <Button
              onClick={stopPlayback}
              leftSection={<MdStop />}
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
            <Button onClick={togglePlaybackPaused} leftSection={<MdPause />} size={'xl'}>
              Pause
            </Button>
            <Button
              onClick={stopPlayback}
              leftSection={<MdStop />}
              color={'red'}
              size={'xl'}
            >
              Stop Playback
            </Button>
          </Group>
        );
      default:
        return (
          <Button onClick={onClick} size={'xl'}>
            Session Rec
          </Button>
        );
    }
  }

  return renderMenuButtons();
}