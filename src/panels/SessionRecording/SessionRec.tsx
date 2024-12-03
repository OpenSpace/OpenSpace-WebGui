import { useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  Container,
  Divider,
  Group,
  Select,
  Stack,
  TextInput,
  ThemeIcon,
  Tooltip
} from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import {
  InformationIcon,
  PlayIcon,
  RecordIcon,
  StopIcon,
  VideocamIcon
} from '@/icons/icons';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  subscribeToSessionRecording,
  unsubscribeToSessionRecording
} from '@/redux/sessionrecording/sessionRecordingMiddleware';
import { RecordingState } from '@/redux/sessionrecording/sessionRecordingSlice';

export function SessionRec() {
  const [useTextFormat, setUseTextFormat] = useState(false);
  const [forceTime, setForceTime] = useState(true);
  const [filenameRecording, setFilenameRecording] = useState('');
  const [filenamePlayback, setFilenamePlayback] = useState<string | null>(null);
  const [shouldOutputFrames, setShouldOutputFrames] = useState(false);
  const [outputFramerate, setOutputFramerate] = useState(60);
  const [loopPlayback, setLoopPlayback] = useState(false);

  const openspace = useOpenSpaceApi();
  const dispatch = useAppDispatch();
  const recordingState = useAppSelector((state) => state.sessionRecording.state);
  const fileList = useAppSelector((state) => state.sessionRecording.files);

  useEffect(() => {
    dispatch(subscribeToSessionRecording());
    //dispatch(subscribeToEngineMode()); // TODO: Add this from store
    return () => {
      dispatch(unsubscribeToSessionRecording());
    };
  }, [dispatch]);

  function isIdle() {
    return recordingState === RecordingState.idle;
  }

  function onLoopPlaybackChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.currentTarget.checked) {
      setLoopPlayback(true);
      setShouldOutputFrames(false);
    } else {
      setLoopPlayback(false);
    }
  }

  function onShouldUpdateFramesChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.currentTarget.checked) {
      setShouldOutputFrames(true);
      setLoopPlayback(false);
    } else {
      setShouldOutputFrames(false);
    }
  }

  function toggleRecording() {
    if (isIdle()) {
      startRecording();
    } else {
      stopRecording();
    }
  }

  function startRecording() {
    if (useTextFormat) {
      openspace?.sessionRecording.startRecordingAscii(filenameRecording);
    } else {
      // Binary
      openspace?.sessionRecording.startRecording(filenameRecording);
    }
  }

  function stopRecording() {
    openspace?.sessionRecording.stopRecording();
  }

  function togglePlayback() {
    if (isIdle()) {
      startPlayback();
    } else {
      stopPlayback();
    }
  }

  function startPlayback() {
    if (shouldOutputFrames) {
      openspace?.sessionRecording.enableTakeScreenShotDuringPlayback(outputFramerate);
    }
    if (forceTime) {
      openspace?.sessionRecording.startPlayback(filenamePlayback!, loopPlayback);
    } else {
      openspace?.sessionRecording.startPlaybackRecordedTime(
        filenamePlayback!,
        loopPlayback
      );
    }
  }

  function stopPlayback() {
    openspace?.sessionRecording.stopPlayback();
  }

  function recordButtonStateProperties() {
    switch (recordingState) {
      case RecordingState.recording:
        return { text: 'Stop Recording', color: 'red', icon: <VideocamIcon /> };
      default:
        // Use default color
        return { text: 'Record', color: undefined, icon: <RecordIcon /> };
    }
  }

  function playbackButtonStateProperties() {
    switch (recordingState) {
      case RecordingState.playing:
      case RecordingState.paused:
        return { text: 'Stop Playback', color: 'red', icon: <StopIcon /> };
      default:
        // Use default color
        return { text: 'Play', color: undefined, icon: <PlayIcon /> };
    }
  }

  return (
    <Container>
      <h2>Record Session</h2>
      <Checkbox
        label={'Text file format'}
        checked={useTextFormat}
        onChange={(event) => setUseTextFormat(event.currentTarget.checked)}
        mb={'sm'}
      ></Checkbox>
      <Group>
        <TextInput
          value={filenameRecording}
          placeholder={'Enter recording filename'}
          aria-label={'Enter recording filename'}
          onChange={(event) => setFilenameRecording(event.currentTarget.value)}
        />
        <Button
          onClick={toggleRecording}
          leftSection={recordButtonStateProperties().icon}
          disabled={!filenameRecording}
          color={recordButtonStateProperties().color}
        >
          {recordButtonStateProperties().text}
        </Button>
      </Group>
      <Divider my={'xs'} />
      <h2 style={{ marginTop: 0 }}>Play Session</h2>
      <Stack gap={'xs'}>
        <Checkbox
          label={'Force time change to recorded time'}
          checked={forceTime}
          onChange={(event) => setForceTime(event.currentTarget.checked)}
        />
        <Checkbox
          label={'Loop playback'}
          checked={loopPlayback}
          onChange={onLoopPlaybackChange}
        />
        <Group>
          <Checkbox
            label={'Output frames'}
            checked={shouldOutputFrames}
            onChange={onShouldUpdateFramesChange}
          />
          <Tooltip
            label={`If checked, the specified number of frames will be recorded as
                screenshots and saved to disk. Per default, they are saved in the
                user/screenshots folder. This feature can not be used together with
                'loop playback'`}
            multiline
            w={220}
            withArrow
            transitionProps={{ duration: 400 }}
            offset={{ mainAxis: 5, crossAxis: 100 }}
            events={{ hover: true, focus: true, touch: true }}
          >
            <ThemeIcon radius={'xl'} size={'sm'}>
              <InformationIcon style={{ width: '80%', height: '80%' }} />
            </ThemeIcon>
          </Tooltip>
          {shouldOutputFrames && (
            <TextInput
              value={outputFramerate}
              placeholder={'framerate'}
              aria-label={'set framerate'}
              onChange={(event) =>
                setOutputFramerate(parseInt(event.currentTarget.value, 10))
              }
              height={22}
              w={120}
            />
          )}
        </Group>
      </Stack>
      <Group gap={'xs'} align={'flex-end'}>
        <Select
          value={filenamePlayback}
          label={'Playback file'}
          placeholder={'Select playback file'}
          data={fileList}
          onChange={setFilenamePlayback}
        />
        <Button
          onClick={togglePlayback}
          leftSection={playbackButtonStateProperties().icon}
          disabled={!filenamePlayback}
          color={playbackButtonStateProperties().color}
        >
          {playbackButtonStateProperties().text}
        </Button>
      </Group>
    </Container>
  );
}
