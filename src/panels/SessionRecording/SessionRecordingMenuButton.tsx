import { ActionIcon, Group } from '@mantine/core';

import { useSubscribeToSessionRecording } from '@/api/hooks';
import { VideocamIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';
import { IconSize } from '@/types/enums';

import { PausePlaybackButton } from './Buttons/PausePlaybackButton';
import { ResumePlaybackButton } from './Buttons/ResumePlaybackButton';
import { StopPlaybackButton } from './Buttons/StopPlaybackButton';
import { StopRecordingButton } from './Buttons/StopRecordingButton';
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
    return <StopRecordingButton filename={fileName} size={'xl'} />;
  }

  if (recordingState === RecordingState.Paused) {
    return (
      <Group gap={2}>
        <ResumePlaybackButton size={'xl'} />
        <StopPlaybackButton size={'xl'} />
      </Group>
    );
  }

  if (recordingState === RecordingState.Playing) {
    return (
      <Group gap={2}>
        <PausePlaybackButton size={'xl'} />
        <StopPlaybackButton size={'xl'} />
      </Group>
    );
  }

  return (
    <ActionIcon onClick={onClick} size={'input-xl'}>
      <VideocamIcon size={IconSize.lg} />
    </ActionIcon>
  );
}
