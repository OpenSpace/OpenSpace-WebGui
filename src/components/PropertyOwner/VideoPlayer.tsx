import { useTranslation } from 'react-i18next';
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
export function VideoPlayer({ uri, ...styleProps }: Props) {
  const { t } = useTranslation('components', {
    keyPrefix: 'property-owner.video-player'
  });
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
            <Tooltip label={t('play-button.tooltip')} openDelay={600}>
              <ActionIcon
                onClick={() => triggerPlay(null)}
                aria-label={t('play-button.aria-label')}
              >
                <IoPlay />
              </ActionIcon>
            </Tooltip>
            <Tooltip label={t('pause-button.tooltip')} openDelay={600}>
              <ActionIcon
                onClick={() => triggerPause(null)}
                aria-label={t('pause-button.aria-label')}
              >
                <IoPause />
              </ActionIcon>
            </Tooltip>
          </ActionIcon.Group>
          <Tooltip label={t('restart-button.tooltip')} openDelay={600}>
            <ActionIcon
              onClick={() => triggerGoToStart(null)}
              size={'sm'}
              aria-label={t('restart-button.aria-label')}
            >
              <MdReplay />
            </ActionIcon>
          </Tooltip>
          <Group gap={5}>
            <Tooltip
              label={loop ? t('loop-toggle.tooltip-on') : t('loop-toggle.tooltip-off')}
              openDelay={600}
            >
              <ToggleActionIcon
                isOn={loop ?? false}
                iconOn={<TbRepeat />}
                iconOff={<TbRepeatOff />}
                onClick={setLoop}
                size={'sm'}
                aria-label={t('loop-toggle.aria-label')}
              />
            </Tooltip>
            <Tooltip
              label={
                playAudio ? t('audio-toggle.tooltip-on') : t('audio-toggle.tooltip-off')
              }
              openDelay={600}
            >
              <ToggleActionIcon
                isOn={playAudio ?? false}
                iconOn={<PiSpeakerSimpleHighFill />}
                iconOff={<PiSpeakerSimpleSlashFill />}
                onClick={setPlayAudio}
                size={'sm'}
                aria-label={t('audio-toggle.aria-label')}
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
