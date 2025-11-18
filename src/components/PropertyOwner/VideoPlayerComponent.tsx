import { IoPause, IoPlay, IoPlaySkipBack } from 'react-icons/io5';
import { MdLoop, MdOutlineReplay } from 'react-icons/md';
import { PiSpeakerSimpleHighFill, PiSpeakerSimpleSlashFill } from 'react-icons/pi';
import { ActionIcon, Card, Group, Title, Tooltip, VisuallyHidden } from '@mantine/core';

import { useProperty } from '@/hooks/properties';
import { usePropertyOwner } from '@/hooks/propertyOwner';
import { Uri } from '@/types/types';

import { InfoBox } from '../InfoBox/InfoBox';

interface Props {
  /* The URI of the Video Player property owner */
  uri: Uri;
}

/**
 * A custom component to render video player controls for a Video Player property owner.
 */
export function VideoPlayerComponent({ uri }: Props) {
  const propertyOwner = usePropertyOwner(uri);

  const [, triggerPlay] = useProperty('TriggerProperty', `${uri}.Play`);
  const [, triggerPause] = useProperty('TriggerProperty', `${uri}.Pause`);
  const [, triggerGoToStart] = useProperty('TriggerProperty', `${uri}.GoToStart`);
  const [, triggerReload] = useProperty('TriggerProperty', `${uri}.Reload`);
  const [loop, setLoop] = useProperty('BoolProperty', `${uri}.LoopVideo`);
  const [playAudio, setPlayAudio] = useProperty('BoolProperty', `${uri}.PlayAudio`);

  if (!propertyOwner) {
    throw Error(`No property owner found for uri: ${uri}`);
  }

  return (
    <Group wrap={'nowrap'}>
      <Card withBorder p={'xs'} bg={'dark'}>
        <VisuallyHidden>
          <Title order={3}>{propertyOwner.name}</Title>
        </VisuallyHidden>
        <Group gap={'xs'}>
          <ActionIcon.Group>
            <Tooltip label={'Jump to start (and pause)'}>
              <ActionIcon onClick={() => triggerGoToStart(null)}>
                <IoPlaySkipBack />
              </ActionIcon>
            </Tooltip>
            <Tooltip label={'Play'}>
              <ActionIcon onClick={() => triggerPlay(null)}>
                <IoPlay />
              </ActionIcon>
            </Tooltip>
            <Tooltip label={'Pause'}>
              <ActionIcon onClick={() => triggerPause(null)}>
                <IoPause />
              </ActionIcon>
            </Tooltip>
          </ActionIcon.Group>

          <Tooltip label={'Reload video. May be useful if there are playback issues.'}>
            <ActionIcon onClick={() => triggerReload(null)} size={'sm'}>
              <MdOutlineReplay />
            </ActionIcon>
          </Tooltip>

          <Group gap={5}>
            {/* TODO: Make a ToggleActionIcon component */}
            <Tooltip label={'Loop video'}>
              <ActionIcon
                size={'sm'}
                variant={loop ? 'filled' : 'light'}
                role={'switch'}
                aria-checked={loop}
                onClick={() => setLoop(!loop)}
              >
                <MdLoop />
              </ActionIcon>
            </Tooltip>
            <Tooltip label={'Play audio'}>
              <ActionIcon
                size={'sm'}
                variant={playAudio ? 'filled' : 'light'}
                role={'switch'}
                aria-checked={playAudio}
                onClick={() => setPlayAudio(!playAudio)}
              >
                {playAudio ? <PiSpeakerSimpleHighFill /> : <PiSpeakerSimpleSlashFill />}
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </Card>
      <InfoBox>
        This object includes a video that can be played back using these controls.
      </InfoBox>
    </Group>
  );
}
