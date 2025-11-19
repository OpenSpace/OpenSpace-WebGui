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
import { ToggleActionIcon } from '../ToggleActionIcon/ToggleActionIcon';

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
              <ActionIcon onClick={() => triggerPlay(null)} aria-label={'Play'}>
                <IoPlay />
              </ActionIcon>
            </Tooltip>
            <Tooltip label={'Pause'} openDelay={600}>
              <ActionIcon onClick={() => triggerPause(null)} aria-label={'Pause'}>
                <IoPause />
              </ActionIcon>
            </Tooltip>
          </ActionIcon.Group>
          <Tooltip label={'Jump to start (and pause)'} openDelay={600}>
            <ActionIcon
              onClick={() => triggerGoToStart(null)}
              size={'sm'}
              aria-label={'Jump to start (and pause)'}
            >
              <MdReplay />
            </ActionIcon>
          </Tooltip>
          <Group gap={5}>
            <Tooltip label={loop ? 'Is looping' : 'Looping disabled'} openDelay={600}>
              <ToggleActionIcon
                isOn={loop ?? false}
                iconOn={<TbRepeat />}
                iconOff={<TbRepeatOff />}
                onClick={setLoop}
                size={'sm'}
                aria-label={'Toggle loop'}
              />
            </Tooltip>
            <Tooltip
              label={playAudio ? 'Is playing audio' : 'Audio is muted'}
              openDelay={600}
            >
              <ToggleActionIcon
                isOn={playAudio ?? false}
                iconOn={<PiSpeakerSimpleHighFill />}
                iconOff={<PiSpeakerSimpleSlashFill />}
                onClick={setPlayAudio}
                size={'sm'}
                aria-label={'Toggle audio'}
              />
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
