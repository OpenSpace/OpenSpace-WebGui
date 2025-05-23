import { useEffect, useState } from 'react';
import { Group, Select, Stack, Title } from '@mantine/core';

import { BoolInput } from '@/components/Input/BoolInput';
import { NumericInput } from '@/components/Input/NumericInput/NumericInput';
import { useSubscribeToSessionRecording } from '@/hooks/topicSubscriptions';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateSessionRecordingSettings } from '@/redux/sessionrecording/sessionRecordingSlice';

import { PlaybackPauseButton } from './Playback/PlaybackPauseButton';
import { PlaybackPlayButton } from './Playback/PlaybackPlayButton';
import { PlaybackResumeButton } from './Playback/PlaybackResumeButton';
import { PlaybackStopButton } from './Playback/PlaybackStopButton';
import { useShowGUI } from './hooks';
import { RecordingState } from './types';

export function PlaySession() {
  const [loopPlayback, setLoopPlayback] = useState(false);
  const [shouldOutputFrames, setShouldOutputFrames] = useState(false);
  const [outputFramerate, setOutputFramerate] = useState(60);
  const { latestFile, hideGuiOnPlayback } = useAppSelector(
    (state) => state.sessionRecording.settings
  );
  const [filenamePlayback, setFilenamePlayback] = useState<string | null>(latestFile);

  const fileList = useAppSelector((state) => state.sessionRecording.files);
  const recordingState = useSubscribeToSessionRecording();
  const [prevRecState, setPrevRecState] = useState<RecordingState>(recordingState);
  const showGUI = useShowGUI();
  const dispatch = useAppDispatch();

  const isIdle = recordingState === RecordingState.Idle;
  const isPlayingBack =
    recordingState === RecordingState.Paused || recordingState === RecordingState.Playing;

  // Update the playback dropdown list to the latest recorded file
  useEffect(() => {
    if (latestFile) {
      setFilenamePlayback(latestFile);
    }
  }, [latestFile]);

  // TODO anden88 2025-05-23: Not a fan of this useEffect. Subscribe to the "SessionRecordingPlayback"
  // somehow? Issue is that it currently resides in the eventsMiddleware so we cant call lua functions
  useEffect(() => {
    if (recordingState !== prevRecState) {
      setPrevRecState(recordingState);
    }

    if (
      prevRecState === RecordingState.Playing &&
      recordingState === RecordingState.Idle &&
      hideGuiOnPlayback
    ) {
      showGUI(true);
    }
  }, [recordingState, prevRecState, hideGuiOnPlayback, showGUI, setPrevRecState]);

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
            'When checked, hides the GUI and overlays during playback. They will reappear after the recording ends.'
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
