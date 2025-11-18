import { IoPause, IoPlay } from 'react-icons/io5';
import { MdReplay } from 'react-icons/md';
import { PiSpeakerSimpleHighFill, PiSpeakerSimpleSlashFill } from 'react-icons/pi';
import { TbRepeat, TbRepeatOff } from 'react-icons/tb';
import { ActionIcon, Card, Group, MantineStyleProps, Tooltip } from '@mantine/core';

import { useProperty } from '@/hooks/properties';
import { usePropertyOwner } from '@/hooks/propertyOwner';
import { Uri } from '@/types/types';

import { InfoBox } from '../InfoBox/InfoBox';
import { Label } from '../Label/Label';

interface Props extends MantineStyleProps {
  /* The URI of the Video Player property owner */
  uri: Uri;
}

/**
 * A custom component to render video player controls for a Video Player property owner.
 */
export function VideoPlayerComponent({ uri, ...styleProps }: Props) {
  const propertyOwner = usePropertyOwner(uri);

  const [, triggerPlay] = useProperty('TriggerProperty', `${uri}.Play`);
  const [, triggerPause] = useProperty('TriggerProperty', `${uri}.Pause`);
  const [, triggerGoToStart] = useProperty('TriggerProperty', `${uri}.GoToStart`);
  const [loop, setLoop] = useProperty('BoolProperty', `${uri}.LoopVideo`);
  const [playAudio, setPlayAudio] = useProperty('BoolProperty', `${uri}.PlayAudio`);

  if (!propertyOwner) {
    throw Error(`No property owner found for uri: ${uri}`);
  }

  return (
    <Group pl={'xs'} wrap={'nowrap'} {...styleProps}>
      <Card withBorder p={'xs'} bg={'transparent'}>
        <Group gap={'xs'}>
          <Label name={'Video'} />
          <ActionIcon.Group>
            <Tooltip label={'Play'} openDelay={600}>
              <ActionIcon onClick={() => triggerPlay(null)}>
                <IoPlay />
              </ActionIcon>
            </Tooltip>
            <Tooltip label={'Pause'} openDelay={600}>
              <ActionIcon onClick={() => triggerPause(null)}>
                <IoPause />
              </ActionIcon>
            </Tooltip>
          </ActionIcon.Group>
          <Tooltip label={'Jump to start (and pause)'} openDelay={600}>
            <ActionIcon onClick={() => triggerGoToStart(null)} size={'sm'}>
              <MdReplay />
            </ActionIcon>
          </Tooltip>
          <Group gap={5}>
            {/* TODO: Make a ToggleActionIcon component */}
            <Tooltip label={'Toggle loop'} openDelay={600}>
              <ActionIcon
                variant={loop ? 'filled' : 'light'}
                role={'switch'}
                aria-checked={loop}
                size={'sm'}
                onClick={() => setLoop(!loop)}
              >
                {loop ? <TbRepeat /> : <TbRepeatOff />}
              </ActionIcon>
            </Tooltip>
            <Tooltip label={'Toggle audio'} openDelay={600}>
              <ActionIcon
                variant={playAudio ? 'filled' : 'light'}
                role={'switch'}
                aria-checked={playAudio}
                size={'sm'}
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
