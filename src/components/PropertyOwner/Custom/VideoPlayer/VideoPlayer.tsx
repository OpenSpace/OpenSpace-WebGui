import { Fragment } from 'react/jsx-runtime';
import { useTranslation } from 'react-i18next';
import {
  ActionIcon,
  Grid,
  Group,
  MantineStyleProps,
  Paper,
  Text,
  ThemeIcon,
  Tooltip
} from '@mantine/core';

import CopyUriButton from '@/components/CopyUriButton/CopyUriButton';
import { InfoBox } from '@/components/InfoBox/InfoBox';
import { ToggleActionIcon } from '@/components/ToggleActionIcon/ToggleActionIcon';
import { useProperty } from '@/hooks/properties';
import { usePropertyOwner } from '@/hooks/propertyOwner';
import {
  PauseIcon,
  PlayIcon,
  RepeatIcon,
  RepeatOffIcon,
  ReplayIcon,
  SoundIcon,
  SoundOffIcon,
  TimeIcon
} from '@/icons/icons';
import styles from '@/theme/global.module.css';
import { IconSize } from '@/types/enums';
import { Uri } from '@/types/types';

interface Props extends MantineStyleProps {
  uri: Uri;
}

export function VideoPlayer({ uri, ...styleProps }: Props) {
  const { t } = useTranslation('components', {
    keyPrefix: 'property-owner.video-player'
  });

  const propertyOwner = usePropertyOwner(uri);

  const playUri = `${uri}.Play`;
  const pauseUri = `${uri}.Pause`;
  const goToStartUri = `${uri}.GoToStart`;
  const loopUri = `${uri}.LoopVideo`;
  const playAudioUri = `${uri}.PlayAudio`;

  const [, triggerPlay, playMeta] = useProperty('TriggerProperty', playUri);
  const [, triggerPause, pauseMeta] = useProperty('TriggerProperty', pauseUri);
  const [, triggerGoToStart, goToStartMeta] = useProperty(
    'TriggerProperty',
    goToStartUri
  );
  const [loop, setLoop, loopMeta] = useProperty('BoolProperty', loopUri);
  const [playAudio, setPlayAudio, playAudioMeta] = useProperty(
    'BoolProperty',
    playAudioUri
  );

  const [isPlaying] = useProperty('BoolProperty', `${uri}.IsPlaying`);
  const [startTime] = useProperty('StringProperty', `${uri}.StartTime`);
  const [endTime] = useProperty('StringProperty', `${uri}.EndTime`);

  if (!propertyOwner) {
    throw Error(`No property owner found for uri: ${uri}`);
  }

  if (startTime || endTime) {
    // This video player is mapped to time, so don't show the playback controls
    return (
      <Paper ml={'xs'} p={'xs'}>
        <Group wrap={'nowrap'} gap={'xs'}>
          <ThemeIcon variant={'subtle'} size={'xs'}>
            <TimeIcon size={IconSize.xs} />
          </ThemeIcon>
          <Text size={'sm'}>{t('mapped-to-time-info')}</Text>
        </Group>
      </Paper>
    );
  }

  // Data for the different properties that the controls represent, to show in the
  // info box
  const propertyData = [
    { uri: playUri, icon: <PlayIcon />, meta: playMeta },
    { uri: pauseUri, icon: <PauseIcon />, meta: pauseMeta },
    { uri: goToStartUri, icon: <ReplayIcon />, meta: goToStartMeta },
    {
      uri: loopUri,
      icon: <RepeatIcon />,
      meta: loopMeta
    },
    { uri: playAudioUri, icon: <SoundIcon />, meta: playAudioMeta }
  ];

  return (
    <Group pl={'xs'} wrap={'nowrap'} {...styleProps}>
      <Group gap={'xs'} py={'xs'}>
        <Tooltip label={isPlaying ? t('pause-button.tooltip') : t('play-button.tooltip')}>
          <ActionIcon
            variant={isPlaying ? 'filled' : 'default'}
            onClick={() => (isPlaying ? triggerPause(null) : triggerPlay(null))}
            aria-label={
              isPlaying ? t('pause-button.aria-label') : t('play-button.aria-label')
            }
          >
            {isPlaying ? <PauseIcon className={styles.blinking} /> : <PlayIcon />}
          </ActionIcon>
        </Tooltip>
        <Tooltip label={t('restart-button.tooltip')}>
          <ActionIcon
            onClick={() => triggerGoToStart(null)}
            size={'sm'}
            aria-label={t('restart-button.aria-label')}
          >
            <ReplayIcon />
          </ActionIcon>
        </Tooltip>
        <Group gap={5}>
          <Tooltip label={t('loop-toggle.tooltip')}>
            <ToggleActionIcon
              isOn={loop ?? false}
              iconOn={<RepeatIcon />}
              iconOff={<RepeatOffIcon />}
              onClick={setLoop}
              size={'sm'}
              aria-label={t('loop-toggle.aria-label')}
            />
          </Tooltip>
          <Tooltip label={t('audio-toggle.tooltip')}>
            <ToggleActionIcon
              isOn={playAudio ?? false}
              iconOn={<SoundIcon />}
              iconOff={<SoundOffIcon />}
              onClick={setPlayAudio}
              size={'sm'}
              aria-label={t('audio-toggle.aria-label')}
            />
          </Tooltip>
        </Group>
      </Group>
      <InfoBox>
        <Text size={'sm'} mb={'xs'}>
          {t('info-box.description')}
        </Text>
        <Grid align={'center'} gutter={2}>
          {propertyData.map(({ uri: propUri, icon, meta }) => (
            <Fragment key={propUri}>
              <Grid.Col span={1.5}>
                <Tooltip label={meta?.guiName} openDelay={600}>
                  <ThemeIcon>{icon}</ThemeIcon>
                </Tooltip>
              </Grid.Col>
              <Grid.Col span={10.5}>
                {propUri && <CopyUriButton uri={propUri} pt={2} />}
              </Grid.Col>
            </Fragment>
          ))}
        </Grid>
      </InfoBox>
    </Group>
  );
}
