import { Group } from '@mantine/core';

import { useSubscribeToSessionRecording } from '@/hooks/topicSubscriptions';
import { VideocamIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';
import { IconSize } from '@/types/enums';
import { MenuItemEventHandlers } from '@/types/types';

import { TaskBarMenuButton } from '../Menu/TaskBar/TaskBarMenuButton';

import { PlaybackPauseButton } from './Playback/PlaybackPauseButton';
import { PlaybackResumeButton } from './Playback/PlaybackResumeButton';
import { PlaybackStopButton } from './Playback/PlaybackStopButton';
import { RecordingStopButton } from './Record/RecordingStopButton';
import { RecordingState } from './types';

interface Props {
  eventHandlers: MenuItemEventHandlers;
  isOpen: boolean;
}

export function SessionRecordingMenuButton({ eventHandlers, isOpen }: Props) {
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
    <TaskBarMenuButton
      {...eventHandlers}
      aria-label={'Session Recording'}
      isOpen={isOpen}
    >
      <VideocamIcon size={IconSize.lg} />
    </TaskBarMenuButton>
  );
}
