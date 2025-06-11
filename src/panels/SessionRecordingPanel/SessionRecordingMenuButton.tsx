import { Group } from '@mantine/core';

import { useSubscribeToSessionRecording } from '@/hooks/topicSubscriptions';
import { VideocamIcon } from '@/icons/icons';
import { TaskBarMenuButton } from '@/panels/Menu/TaskBar/TaskBarMenuButton';
import { IconSize } from '@/types/enums';

import { PlaybackPauseButton } from './Playback/PlaybackPauseButton';
import { PlaybackResumeButton } from './Playback/PlaybackResumeButton';
import { PlaybackStopButton } from './Playback/PlaybackStopButton';
import { RecordingStopButton } from './Record/RecordingStopButton';
import { RecordingState } from './types';

interface Props {
  id: string;
}

export function SessionRecordingMenuButton({ id }: Props) {
  const recordingState = useSubscribeToSessionRecording();

  if (recordingState === RecordingState.Recording) {
    return <RecordingStopButton size={'xl'} />;
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
    <TaskBarMenuButton id={id}>
      <VideocamIcon size={IconSize.lg} />
    </TaskBarMenuButton>
  );
}
