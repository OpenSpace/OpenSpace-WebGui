import { useTranslation } from 'react-i18next';
import { ActionIcon, Group, NumberFormatter, Stack, Text } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { useSubscribeToEngineMode } from '@/hooks/topicSubscriptions';
import { FastForwardIcon, FastRewindIcon, PauseIcon, PlayIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';
import { EngineMode, IconSize } from '@/types/enums';

import { useTimePartTranslation } from './hooks';
import { formatDeltaTime } from './util';

export function DeltaTimeStepsControl() {
  const { t } = useTranslation('panel-time');

  const nextDeltaTimeStep = useAppSelector((state) => state.time.nextDeltaTimeStep) ?? 0;
  const prevDeltaTimeStep = useAppSelector((state) => state.time.prevDeltaTimeStep) ?? 0;
  const isPaused = useAppSelector((state) => state.time.isPaused);

  const hasNextDeltaTimeStep = useAppSelector((state) => state.time.hasNextDeltaTimeStep);
  const hasPrevDeltaTimeStep = useAppSelector((state) => state.time.hasPrevDeltaTimeStep);

  const luaApi = useOpenSpaceApi();
  const engineMode = useSubscribeToEngineMode();
  const isInFlight = engineMode === EngineMode.CameraPath;

  const translateTimePart = useTimePartTranslation();

  const {
    increment: nextIncrement,
    unit: nextUnit,
    isNegative: isNextStepNegative
  } = formatDeltaTime(nextDeltaTimeStep);
  const {
    increment: nextDecrement,
    unit: prevUnit,
    isNegative: isPrevStepNegative
  } = formatDeltaTime(prevDeltaTimeStep);

  const nextLabel =
    ` ${translateTimePart(nextUnit, nextIncrement)} / ${t('time-parts.seconds_one')}`.toLocaleLowerCase();
  const prevLabel =
    ` ${translateTimePart(prevUnit, nextDecrement)} / ${t('time-parts.seconds_one')}`.toLocaleLowerCase();

  function setPrevDeltaTimeStep(event: React.MouseEvent<HTMLElement>) {
    if (event.shiftKey) {
      luaApi?.time.setPreviousDeltaTimeStep();
    } else {
      luaApi?.time.interpolatePreviousDeltaTimeStep();
    }
  }

  function setNextDeltaTimeStep(event: React.MouseEvent<HTMLElement>) {
    if (event.shiftKey) {
      luaApi?.time.setNextDeltaTimeStep();
    } else {
      luaApi?.time.interpolateNextDeltaTimeStep();
    }
  }

  function togglePause(event: React.MouseEvent<HTMLElement>) {
    if (event.shiftKey) {
      luaApi?.time.togglePause();
    } else {
      luaApi?.time.interpolateTogglePause();
    }
  }

  return (
    <Group gap={'xs'} align={'flex-start'}>
      <Stack gap={0} flex={3}>
        <ActionIcon
          onClick={setPrevDeltaTimeStep}
          disabled={!hasPrevDeltaTimeStep}
          size={'lg'}
          w={'100%'}
          aria-label={t('delta-time-step-control.aria-labels.previous-step')}
        >
          <FastRewindIcon size={IconSize.md} />
        </ActionIcon>
        <Text c={'dimmed'}>
          {hasPrevDeltaTimeStep && (
            <NumberFormatter
              value={nextDecrement}
              prefix={isPrevStepNegative ? '-' : ''}
              suffix={prevLabel}
              decimalScale={0}
              allowNegative={false}
            />
          )}
        </Text>
      </Stack>
      <ActionIcon
        onClick={togglePause}
        size={'lg'}
        aria-label={`${
          isPaused
            ? t('delta-time-step-control.aria-labels.toggle-pause.play')
            : t('delta-time-step-control.aria-labels.toggle-pause.pause')
        }`}
        flex={2}
        disabled={isInFlight}
      >
        {isPaused ? <PlayIcon size={IconSize.md} /> : <PauseIcon size={IconSize.md} />}
      </ActionIcon>
      <Stack gap={0} flex={3}>
        <ActionIcon
          onClick={setNextDeltaTimeStep}
          disabled={!hasNextDeltaTimeStep}
          size={'lg'}
          w={'100%'}
          aria-label={t('delta-time-step-control.aria-labels.next-step')}
        >
          <FastForwardIcon size={IconSize.md} />
        </ActionIcon>
        <Text c={'dimmed'}>
          {hasNextDeltaTimeStep && (
            <NumberFormatter
              value={nextIncrement}
              prefix={isNextStepNegative ? '-' : ''}
              suffix={nextLabel}
              decimalScale={0}
              allowNegative={false}
            />
          )}
        </Text>
      </Stack>
    </Group>
  );
}
