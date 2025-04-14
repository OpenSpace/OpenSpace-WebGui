import { ActionIcon, Group, NumberFormatter, Stack, Text } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { FastForwardIcon, FastRewindIcon, PauseIcon, PlayIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';
import { IconSize } from '@/types/enums';

import { formatDeltaTime } from './util';

export function DeltaTimeStepsControl() {
  const luaApi = useOpenSpaceApi();
  const nextDeltaTimeStep = useAppSelector((state) => state.time.nextDeltaTimeStep) ?? 0;
  const prevDeltaTimeStep = useAppSelector((state) => state.time.prevDeltaTimeStep) ?? 0;
  const isPaused = useAppSelector((state) => state.time.isPaused);

  const hasNextDeltaTimeStep = useAppSelector((state) => state.time.hasNextDeltaTimeStep);
  const hasPrevDeltaTimeStep = useAppSelector((state) => state.time.hasPrevDeltaTimeStep);

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

  const nextLabel = ` ${nextUnit} / second`;
  const prevLabel = ` ${prevUnit} / second`;

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
          aria-label={'Set previous delta time step'}
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
        aria-label={`${isPaused ? 'Play' : 'Pause'} time`}
        flex={2}
      >
        {isPaused ? <PlayIcon size={IconSize.md} /> : <PauseIcon size={IconSize.md} />}
      </ActionIcon>
      <Stack gap={0} flex={3}>
        <ActionIcon
          onClick={setNextDeltaTimeStep}
          disabled={!hasNextDeltaTimeStep}
          size={'lg'}
          w={'100%'}
          aria-label={'Set next delta time step'}
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
