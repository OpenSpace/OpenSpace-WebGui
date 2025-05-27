import { useEffect, useState } from 'react';
import { Group, Select, Stack, Title } from '@mantine/core';

import { BoolInput } from '@/components/Input/BoolInput';
import { NumericInput } from '@/components/Input/NumericInput/NumericInput';
import { useSubscribeToProperty } from '@/hooks/properties';
import { useSubscribeToSessionRecording } from '@/hooks/topicSubscriptions';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateSessionRecordingSettings } from '@/redux/sessionrecording/sessionRecordingSlice';

import { PlaybackPauseButton } from './Playback/PlaybackPauseButton';
import { PlaybackPlayButton } from './Playback/PlaybackPlayButton';
import { PlaybackResumeButton } from './Playback/PlaybackResumeButton';
import { PlaybackStopButton } from './Playback/PlaybackStopButton';
import { RecordingState } from './types';

export function PlaySession() {
  const [loopPlayback, setLoopPlayback] = useState(false);
  const [shouldOutputFrames, setShouldOutputFrames] = useState(false);
  const [outputFramerate, setOutputFramerate] = useState(60);
  const { latestFile, hideGuiOnPlayback, hideDashboardsOnPlayback } = useAppSelector(
    (state) => state.sessionRecording.settings
  );
  const [filenamePlayback, setFilenamePlayback] = useState<string | null>(latestFile);

  const fileList = useAppSelector((state) => state.sessionRecording.files);
  const recordingState = useSubscribeToSessionRecording();
  const dispatch = useAppDispatch();

  // Subscribe to Properties so that the middleware will be notified on updated values
  useSubscribeToProperty('Modules.CefWebGui.Visible');
  useSubscribeToProperty('RenderEngine.ShowLog');
  useSubscribeToProperty('RenderEngine.ShowVersion');
  useSubscribeToProperty('Dashboard.IsEnabled');

  const isIdle = recordingState === RecordingState.Idle;
  const isPlayingBack =
    recordingState === RecordingState.Paused || recordingState === RecordingState.Playing;

  // Update the playback dropdown list to the latest recorded file
  useEffect(() => {
    if (latestFile) {
      setFilenamePlayback(latestFile);
    }
  }, [latestFile]);

  function onLoopPlaybackChange(shouldLoop: boolean): void {
    if (shouldLoop) {
      setLoopPlayback(true);
      setShouldOutputFrames(false);
    } else {
      setLoopPlayback(false);
    }
  }

  function onShouldUpdateFramesChange(shouldOutputFrames: boolean): void {
    if (shouldOutputFrames) {
      setShouldOutputFrames(true);
      setLoopPlayback(false);
    } else {
      setShouldOutputFrames(false);
    }
  }

  return (
    <>
      <Title order={2} my={'xs'}>
        Play
      </Title>
      <Stack gap={'xs'}>
        <BoolInput
          label={'Loop playback'}
          value={loopPlayback}
          onChange={onLoopPlaybackChange}
          disabled={!isIdle}
        />
        <Group>
          <BoolInput
            label={'Output frames'}
            value={shouldOutputFrames}
            onChange={onShouldUpdateFramesChange}
            disabled={!isIdle}
            info={`If checked, the specified number of frames will be recorded as
              screenshots and saved to disk. Per default, they are saved in the
              user/screenshots folder. This feature can not be used together with
              'Loop playback'`}
          />
          <NumericInput
            value={outputFramerate}
            placeholder={'Framerate'}
            aria-label={'Set framerate'}
            onEnter={(value) => setOutputFramerate(value)}
            w={80}
            disabled={!shouldOutputFrames || !isIdle}
          />
        </Group>
        <BoolInput
          label={'Hide GUI on playback'}
          value={hideGuiOnPlayback}
          onChange={(value) =>
            dispatch(updateSessionRecordingSettings({ hideGuiOnPlayback: value }))
          }
          info={
            'When checked, hides the GUI during playback. It will reappear after the recording ends.'
          }
          disabled={isPlayingBack}
        />
        <BoolInput
          label={'Hide dashboards on playback'}
          value={hideDashboardsOnPlayback}
          onChange={(value) =>
            dispatch(updateSessionRecordingSettings({ hideDashboardsOnPlayback: value }))
          }
          info={
            'When checked, hides the dashboard overlays during playback. They will reappear after the recording ends.'
          }
          disabled={isPlayingBack}
        />
        <Group gap={'xs'} align={'flex-end'}>
          <Select
            value={filenamePlayback}
            label={'Playback file'}
            placeholder={'Select playback file'}
            data={fileList}
            onChange={setFilenamePlayback}
            searchable
            disabled={!isIdle}
          />
          <PlaybackPlayButton
            disabled={isPlayingBack || !filenamePlayback}
            filename={filenamePlayback}
            loopPlayback={loopPlayback}
            shouldOutputFrames={shouldOutputFrames}
            outputFramerate={outputFramerate}
          />
        </Group>
        <Group gap={'xs'}>
          {recordingState === RecordingState.Paused && <PlaybackResumeButton />}
          {recordingState === RecordingState.Playing && <PlaybackPauseButton />}
          {isPlayingBack && <PlaybackStopButton />}
        </Group>
      </Stack>
    </>
  );
}
