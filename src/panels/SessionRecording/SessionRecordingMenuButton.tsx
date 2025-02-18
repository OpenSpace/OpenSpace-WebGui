import { ActionIcon, Group } from '@mantine/core';

import { useSubscribeToSessionRecording } from '@/api/hooks';
import { VideocamIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';
import { IconSize } from '@/types/enums';

import { PlaybackPauseButton } from './Playback/PlaybackPauseButton';
import { PlaybackResumeButton } from './Playback/PlaybackResumeButton';
import { PlaybackStopButton } from './Playback/PlaybackStopButton';
import { RecordingStopButton } from './Record/RecordingStopButton';
import { RecordingState } from './types';

interface SessionRecMenuButtonProps {
  onClick: () => void;
}

export function SessionRecordingMenuButton({ onClick }: SessionRecMenuButtonProps) {
  const recordingState = useSubscribeToSessionRecording();

  const { recordingFileName: fileName } = useAppSelector(
    (state) => state.sessionRecording.settings
  );

  if (recordingState === RecordingState.Recording) {
    return <RecordingStopButton filename={fileName} size={'xl'} />;
  }

  if (recordingState === RecordingState.Paused) {
    return (
      <Group gap={2}>
        <PlaybackResumeButton size={'xl'} />
        <PlaybackStopButton size={'xl'} />
      </Group>
    );
  }

  if (recordingState === RecordingState.Playing) {
    return (
      <Group gap={2}>
        <PlaybackPauseButton size={'xl'} />
        <PlaybackStopButton size={'xl'} />
      </Group>
    );
  }

  return (
    <ActionIcon onClick={onClick} size={'input-xl'}>
      <VideocamIcon size={IconSize.lg} />
    </ActionIcon>
  );
}
